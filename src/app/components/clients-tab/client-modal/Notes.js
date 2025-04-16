function Notes({ notes, isViewMode, onChange }) {
  return isViewMode ? (
    <div>
      <div className="text-sm flex flex-col gap-2">
        <h3 className="font-semibold">Komentarai</h3>
        <div className="text-xs p-2 border rounded-md whitespace-pre-wrap break-words">
          {notes?.trim() || 'Nėra komentarų'}
        </div>
      </div>
    </div>
  ) : (
    <div className="text-sm flex flex-col gap-2">
      <h3 className="font-semibold">Komentarai</h3>
      <textarea
        className="w-full h-24 border shadow-sm border-gray-300 rounded-md p-2 max-h-24 overflow-y-auto resize-none text-xs "
        name="notes"
        value={notes || ''}
        onChange={onChange}
        maxLength={150}
      />
      <p
        className={`text-xs text-right ${
          notes?.length > 130 ? 'text-danger' : 'text-foreground'
        }`}
      >
        {notes?.length || 0}/150 simbolių
      </p>
    </div>
  );
}

export default Notes;
