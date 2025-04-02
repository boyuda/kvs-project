function Notes() {
  //TODO: Implement notes functionality
  return (
    <div>
      <div className="text-sm flex flex-col gap-2">
        <h3 className="font-medium">Komentarai</h3>
        <textarea className="w-full  h-24 border rouder-md p-2 max-h-24 overflow-y-auto resize-none text-xs" />
      </div>
    </div>
  );
}

export default Notes;
