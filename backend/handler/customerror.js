class CustomError extends Error{
constructor(statuscode , message){
super(message);
this.statuscode=statuscode;
}  
}
export default CustomError;





















