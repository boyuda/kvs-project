export default function ConditionalSalesFields({
  selectedType,
  clientServices = [],
  selectedServiceId,
  setSelectedServiceId,
  selectedTerm,
  setSelectedTerm,
  selectedAmount,
  setSelectedAmount,
  task,
}) {
  const isRenewal = selectedType === 'contract_renewal';
  const isNewService = selectedType === 'new_service';

  const selectedService = clientServices.find(
    (s) => s.id === selectedServiceId
  );
  // Calculate new term
  const currentEndDate = selectedService?.end_date;
  let newEndDate = '';
  if (selectedService?.end_date && selectedTerm) {
    const currentDate = new Date(selectedService.end_date);
    currentDate.setMonth(currentDate.getMonth() + Number(selectedTerm));
    newEndDate = currentDate.toISOString().split('T')[0];
  }

  return (
    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">
        {isRenewal ? 'Atnaujinama Paslauga' : 'Nauja Paslauga'}
      </h3>

      {isRenewal && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 w-full">
            {/* Service */}
            <div className="flex-1 min-w-[120px]">
              <label className="text-sm font-medium block mb-1">Paslauga</label>
              <select
                className="w-full p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                <option value="">Pasirinkite</option>
                {clientServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.services.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Term */}
            <div className="flex-1 min-w-[120px]">
              <label className="text-sm font-medium block mb-1">
                Nauja trukmė
              </label>
              <select
                className="w-full p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                <option value="">Pasirinkite</option>
                <option value="6">6 mėn.</option>
                <option value="12">12 mėn.</option>
                <option value="18">18 mėn.</option>
                <option value="24">24 mėn.</option>
              </select>
            </div>

            {/* Amount */}
            <div className="flex-1 min-w-[120px]">
              <label className="text-sm font-medium block mb-1">
                Įkainis/mėn. (€)
              </label>
              <input
                type="number"
                placeholder="Pvz. 10.99"
                className="w-full p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                onChange={(e) => setSelectedAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Date info */}
          {selectedService && (
            <div className="text-sm text-gray-700">
              Dabartinis terminas iki: <strong>{currentEndDate}</strong>
              <br />
              Naujasis terminas baigsis: <strong>{newEndDate || '–'}</strong>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Pasirinkite paslaugą ir naują trukmę.{' '}
            {selectedService
              ? 'Išsaugojus užduotį, paslaugos terminas bus atnaujintas.'
              : 'Pasirinkite paslaugą, kad matytumėte informaciją.'}
          </p>
        </div>
      )}

      {isNewService && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 w-full">
            {/* Service Type */}
            <div className="flex-1 min-w-[120px]">
              <label className="text-sm font-medium block mb-1">
                Paslaugos tipas
              </label>
              <select
                className="w-full p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                <option value="">Pasirinkite</option>
                <option value="a56aca47-70f1-480f-9029-e8ef82e7e11b">
                  IPTV
                </option>
                <option value="532f4c0e-99cd-4c25-a78e-991dc19870eb">
                  Internetas
                </option>
              </select>
            </div>

            {/* Term Duration */}
            <div className="flex-1 min-w-[120px]">
              <label className="text-sm font-medium block mb-1">
                Sutarties trukmė
              </label>
              <select
                className="w-full p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                <option value="">Pasirinkite</option>
                <option value="6">6 mėn.</option>
                <option value="12">12 mėn.</option>
                <option value="18">18 mėn.</option>
                <option value="24">24 mėn.</option>
              </select>
            </div>

            {/* Amount Input */}
            <div className="flex-1 min-w-[120px]">
              <label className="text-sm font-medium block mb-1">
                Įkainis/mėn. (€)
              </label>
              <input
                type="number"
                placeholder="Pvz. 10.99"
                className="w-full p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Tip */}
          <p className="text-xs text-gray-500  ">
            Pasirinkite paslaugos tipą ir trukmę. Išsaugojus užduotį, nauja
            paslauga bus pridėta klientui.
          </p>
        </div>
      )}
    </div>
  );
}
