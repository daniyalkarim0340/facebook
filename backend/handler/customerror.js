class Customerror extends Error{
constructor(statuscode , message){
super(message);
this.statuscode=statuscode;
}  
}
export default Customerror;