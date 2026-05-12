const Custommiddleware = (err, req, res, next) => {
    const statuscode = err.statuscode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statuscode).json({ message });
}
export default Custommiddleware;