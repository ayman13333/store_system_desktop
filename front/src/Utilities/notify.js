
const Notify = ({ msg, type }) => {
  return <div className={`alert alert-${type}`} role="alert">
    {msg}
  </div>
};

export default Notify;
