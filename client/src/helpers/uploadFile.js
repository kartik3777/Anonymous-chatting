

// const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/auto/upload`;
const url = `https://api.cloudinary.com/v1_1/dwrk6wu1n/auto/upload`;


const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", "chat-app-file");

    const response = await fetch(url, {
        method:'post',
        body:formData
    });

    const responseData = await response.json();

    console.log("response data from cloud",responseData);

    return responseData;
} 

export default uploadFile;