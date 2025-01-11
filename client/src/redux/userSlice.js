import { createSlice } from '@reduxjs/toolkit'

const initialState= {
    
 _id:"",
 name: "",
 email:"",
 profile:"",
 rollno:"",
 gender:"",
 token:"",
 branch:"",
 onlineUser: [],
 blockedUsers:[],
 isblocked:"",
 socket: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action)=> {
        state._id= action.payload._id
        state.name= action.payload.name
        state.email= action.payload.email
        state.profile= action.payload.profile
        state.rollno= action.payload.rollno
        state.gender= action.payload.gender
        state.branch = action.payload.branch
        state.blockedUsers = action.payload.blockedUsers
        state.isblocked = action.payload.isblocked
    },
    setToken : (state, action) => {
        state.token = action.payload
    },
    logout : (state, action) => {
        state._id= ""
        state.name= ""
        state.email= ""
        state.profile= ""
        state.rollno= ""
        state.gender= ""
        state.token= ""
        state.branch= ""
        state.isblocked=""
        state.blockedUsers=[]
        state.socket=null
        localStorage.removeItem('state')
    },
    setOnlineUser : (state, action) => {
        state.onlineUser = action.payload
    },
    setSocket : (state, action) => {
      state.socket = action.payload
    }
    
  },
})

// Action creators are generated for each case reducer function
export const {setUser,  setToken, logout, setOnlineUser, setSocket } = userSlice.actions

export default userSlice.reducer