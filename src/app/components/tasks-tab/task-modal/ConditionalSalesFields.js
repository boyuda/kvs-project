// components/task-modal/ConditionalSalesFields.jsx
export default function ConditionalSalesFields({ selectedType }) {
  const isRenewal = selectedType === 'contract_renewal';
  const isNewService = selectedType === 'new_service';

  return (
    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">
        {isRenewal ? 'Atnaujinama Paslauga' : 'Nauja Paslauga'}
      </h3>

      {/* Single Entry */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 w-full">
          {/* Service Type */}
          <div className="flex-1 min-w-[120px]">
            <label className="text-sm font-medium block mb-1">
              Paslaugos tipas
            </label>
            <select className="w-full p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
              <option value="">Pasirinkite</option>
              <option value="iptv">IPTV</option>
              <option value="internet">Internetas</option>
            </select>
          </div>

          {/* Term Duration */}
          <div className="flex-1 min-w-[120px]">
            <label className="text-sm font-medium block mb-1">
              Sutarties trukmė
            </label>
            <select className="w-full p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
              <option value="">Pasirinkite</option>
              <option value="6">6 mėn.</option>
              <option value="12">12 mėn.</option>
              <option value="18">18 mėn.</option>
              <option value="24">24 mėn.</option>
            </select>
          </div>

          {/* Amount Input */}
          <div className="flex-1 min-w-[120px]">
            <label className="text-sm font-medium block mb-1">Suma (€)</label>
            <input
              type="number"
              placeholder="Pvz. 10.99"
              className="w-full p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Tip */}
        <p className="text-xs text-gray-500  ">
          Pasirinkite paslaugos tipą ir trukmę. Išsaugojus užduotį,
          {isRenewal
            ? ' turimos paslaugos terminas bus atnaujintas.'
            : ' nauja paslauga bus pridėta klientui.'}
        </p>
      </div>
    </div>
  );
}
