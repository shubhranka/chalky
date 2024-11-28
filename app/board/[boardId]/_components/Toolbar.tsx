const Toolbar = () => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
        <div className="bg-white rounded-md p-1.5 flex flex-col items-center gap-y-1 shadow-md">
            <div>Pencil</div>
            <div>Square</div>
            <div>Ellipcis</div>
        </div>

        <div className="bg-white rounded-md p-1.5 flex flex-col items-center gap-y-1 shadow-md">
            <div>Undo</div>
            <div>Redo</div>
        </div>
    </div>
  );
};

export default Toolbar;