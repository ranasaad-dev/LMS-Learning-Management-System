import "./Loading.css";
function Loading({message}){
    return(
        <>
        <div className="loader"></div>
       { message?<span>{message}</span>:null}
        </>
    )
}
export default Loading;