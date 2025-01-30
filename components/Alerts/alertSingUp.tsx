const Alert1 = ({ message }: { message: string }) => {
  return (
    <div className="flex bg-green-100 shadow-lg rounded-lg mt-4">
      <div className="bg-green-600 flex justify-center items-center py-4 px-6 rounded-tr-3xl rounded-lg">
        <span className="text-white text-2xl">✅</span>
      </div>
      <div className="flex flex-col p-4">
        <h2 className="font-semibold text-green-600">Success</h2>
        <p className="text-green-800">{message}</p>
      </div>
    </div>
  );
};

export default Alert1;
