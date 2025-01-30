const AlertSignInError = ({ message }: { message: string }) => {
  return (
    <div className="flex bg-red-100 shadow-lg rounded-lg overflow-hidden">
      <div className="bg-red-600 flex justify-center items-center py-4 px-6 rounded-tr-3xl rounded-lg">
        <span className="text-white text-2xl">❌</span>
      </div>
      <div className="flex flex-col p-4">
        <h2 className="font-semibold text-red-600">Error</h2>
        <p className="text-red-800">{message}</p>
      </div>
    </div>
  );
};

export default AlertSignInError;
