import React, {useState, useEffect} from 'react'
import './Search.css'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avtar from '../avtar/Avtar';

function SearchedContent(props) {
  const onlineUser = useSelector(state => state.user.onlineUser);
  const navigate = useNavigate();

  const isOnline = onlineUser.includes(props._id);
  isOnline && console.log(`user ${props._id} is online`);

  const handleMessageClick = () => {
    navigate(`/nav/message/${props._id}`);
  };

  return (
    <div className="searched-boxes">
      <div className="rec-image">
        <Avtar profile={props.profile} size="100px"   />
        {/* <img src={isMale ? "/male.jpg" : "/female.jpg"} alt="" /> */}
      </div>
      <p>{props.name}</p>
      <p>{props.rollno}</p>
      <p>{props.branch}</p>
      <div className='match-outer'>
        <div style={{width: `${props.matched}%`}} className='match'></div>
        <span className='match-perc'>Matched: {props.matched}%</span>
      </div>
      {isOnline && <p style={{color: "lightgreen"}}>online</p>}
      <button className='search-msg' onClick={handleMessageClick}>Message</button>
    </div>
  );
}


  
function Search() {
 

    const [searchValue, setSearchValue] = useState("");
    const [mainfilteredData, setFilteredData] = useState([]);
    const [prevData, setPrevData] = useState([]);
    const [length, setLength] = useState(0);

//  const navigate = useNavigate();
 const [allData, setAllData] = useState([]);

 axios.defaults.withCredentials = true;

 //**** test vala isme nhi aayega kyuki uska roll no int me hai isiliye pagelimit 8759 ki rakhi hai apiFeatures me backend me
    useEffect(() => {
        axios.get("http://localhost:8000/api/v1/users/",)
        .then(res => {
            console.log("data from api", res.data.data.users);
            setAllData(res.data.data.users);
            setLength(res.data.data.users.length);
        }).catch(err => {
            console.log(err);
        //  alert("error in loading data");
        })
    }, [])

    function handleChange(e) {
        const { value } = e.target;
        setSearchValue(value);
        
        // Filter data based on search input
        const filteredData = allData.filter(item => {
          // Convert all properties to lowercase for case-insensitive search
          const lowerCaseValue = value.toLowerCase();
          return (
            item?.name?.toLowerCase().includes(lowerCaseValue) ||
            item?.rollno?.toLowerCase().includes(lowerCaseValue) ||
            item?.branch?.toLowerCase().includes(lowerCaseValue)
            // You can include additional properties for searching
          );
        });
      
        setFilteredData(filteredData);
        setPrevData(filteredData);
        setLength(filteredData.length);
      }
      
    function eraseSearch(){
      setSearchValue("");
      setFilteredData([]);
      setLength(0);
    }
    
    //#####  One thing about filters is that only one is working at a time so have to correct it

    //done
    function handleBatchFilter(e){
      if(e){
        const batch = e.target.innerText;
        const batchValue = document.getElementById("batchMainValue");
        batchValue.innerText = batch;
            const filteredData = allData.filter(item => item.rollno.slice(0, 2) === batch.slice(1,3));
            setFilteredData(filteredData);
            setLength(filteredData.length);
      }
      }

      //*****working but not complete bcoz all branch is not included
    function handleBranchFilter(e) {
      if(e){
        let branch = e.target.innerText;
        const branchValue = document.getElementById("branchMainValue");
        branchValue.innerText = branch;
        if(branch === "Cse") branch = "Computer Science and Engineering"
        else if(branch === "Ee") branch = "Electrical Engineering" 
        else if(branch === "Bsbe") branch = "Electrical Engineering" 
        else if(branch === "Mth") branch = "Electrical Engineering"
        else if(branch === "Me") branch = "Mechanical Engineering"
        else if(branch === "Mse") branch = "Materials Science and Engineering"
        else if(branch === "Ce") branch = "Civil Engineering"
        else if(branch === "Eco") branch = "Economics"
        else if(branch === "Chm") branch = "Chemistry"
        else if(branch === "Phy") branch = "Physics"
        else if(branch === "Che") branch = "Chemical Engineering"
        else if(branch === "Phy") branch = "Electrical Engineering"
            const filteredData = allData.filter(item => item.branch === branch);
        setFilteredData(filteredData);
        setLength(filteredData.length);
      }
      }
     //left
    function handleMatchFilter(e){
      if(e){
        const match = e.target.innerText;
        const matchValue = document.getElementById("matchMainValue");
        matchValue.innerText = match;
      }
    }
    //done
    function handleRemoveFilter(){
        const matchValue = document.getElementById("matchMainValue");
        matchValue.innerText = "Match";
        const branchValue = document.getElementById("branchMainValue");
      branchValue.innerText = "Branch";
      const batchValue = document.getElementById("batchMainValue");
      batchValue.innerText = "Batch";
      setFilteredData(prevData);
      
    }

  return (
    <div className='search-page-main'>
        <div className="upper-search">
      <div className="search-area">
        <div className="search-icon"><SearchIcon style={{fontSize:"35px", color:"grey"}} /></div>
        <input onChange={handleChange} value={searchValue} type="text" placeholder="Search" />
        <div onClick={eraseSearch} className="erase-icon"><CloseIcon id="closeIcon" style={{fontSize:"35px", color:"grey"}} /></div>
        {/* <button>Search</button> */}
      </div>

   <div className="filter-boxes">
    <h3 style={{margin:"5px"}}>Filters:</h3>
    <div className="batch-outer">
        <div className="batchh-filter filter-box">
           <p id='batchMainValue'>Batch</p> 
           <div className="down-icon"><ArrowDropDownIcon style={{fontSize:"31px"}}/></div>
        </div>
        <div onClick={handleBatchFilter} className="drop-batch">Y23</div>
        <div onClick={handleBatchFilter} className="drop-batch">Y22</div>
        <div onClick={handleBatchFilter} className="drop-batch">Y21</div>
        <div onClick={handleBatchFilter} className="drop-batch">Y20</div>
        </div>

         <div className="branch-outer">
        <div className="branch-filter filter-box">
        <p id='branchMainValue'>Branch</p> 
           <div className="down-icon"><ArrowDropDownIcon style={{fontSize:"31px"}}/></div>
        </div>
        <div onClick={handleBranchFilter} className="drop-batch">Cse</div>
        <div onClick={handleBranchFilter} className="drop-batch">Bsbe</div>
        <div onClick={handleBranchFilter} className="drop-batch">Mth</div>
        <div onClick={handleBranchFilter} className="drop-batch">Me</div>
        <div onClick={handleBranchFilter} className="drop-batch">Mse</div>
        <div onClick={handleBranchFilter} className="drop-batch">Ce</div>
        <div onClick={handleBranchFilter} className="drop-batch">Eco</div>
        <div onClick={handleBranchFilter} className="drop-batch">Chm</div>
        <div onClick={handleBranchFilter} className="drop-batch">Phy</div>
        </div>

      <div className="match-filter-outer">
        <div className="match-filter filter-box">
        <p id='matchMainValue'>Match</p> 
           <div className="down-icon"><ArrowDropDownIcon style={{fontSize:"31px"}}/></div>
        </div>
        <div onClick={handleMatchFilter} className="drop-batch">90+</div>
        <div onClick={handleMatchFilter} className="drop-batch">80+</div>
        <div onClick={handleMatchFilter} className="drop-batch">70+</div>
        <div onClick={handleMatchFilter} className="drop-batch">60+</div>
        </div>

        <div onClick={handleRemoveFilter} className="match-filter filter-box">
        <p>Remove filters</p> 
           <div className="down-icon"><ClearIcon style={{fontSize:"25px"}}/></div>
        </div>
   </div>
        
      </div>
      <div className="search-ke-neeche">
      <p>** You can only search for your opposite gender</p>
      <h3>{length} results</h3>
      </div>
     
      <div className="search-content">
      {/* here data should be displayed */}
      {mainfilteredData.map((item, index) => (
          <SearchedContent
            key={index}
            name={item.name}
            rollno={item.rollno}
            branch={item.branch}
            matched={item.matched}
            _id={item._id}
            profile = {item.profile}
          />
        ))}
     </div>

    </div>
  )
}

export default Search
