export default function TasksList() {
  // Helper function for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'atviras':
        return 'bg-green-100 text-green-600';
      case 'vykdoma':
        return 'bg-yellow-100 text-yellow-600';
      case 'uzdaryta':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="text-sm flex flex-col gap-2 text-texts">
      <div className=" flex justify-between items-center">
        <h3 className="font-medium">Užduotys</h3>
        <button className="font-medium text-xl">+</button>
      </div>
      <div className="border rounded-lg p-2 overflow-y-auto max-h-40">
        <ul className="divide-y">
          {/* Task 1 */}
          <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md grid grid-cols-[60%_20%_20%]">
            <div className="flex flex-col">
              <span className="font-medium truncate">Paskambinti ryte</span>
              <span className="text-gray-500 text-xs">Nauja paslauga</span>
            </div>
            <div className="">
              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  'vykdoma'
                )}`}
              >
                Vykdoma
              </span>
            </div>
            <div className="">
              <span className="text-xs text-gray-500">2025-04-15</span>
            </div>
          </li>

          {/* Task 2 */}
          <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md grid grid-cols-[60%_20%_20%]">
            <div className="flex flex-col">
              <span className="font-medium truncate">Kalbėt su Tadu</span>
              <span className="text-gray-500 text-xs">
                Sutarties pratęsimas
              </span>
            </div>
            <div className="">
              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  'atviras'
                )}`}
              >
                Atviras
              </span>
            </div>
            <div className="">
              <span className="text-xs text-gray-500">2025-04-15</span>
            </div>
          </li>
          {/* Task 3 */}
          <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md grid grid-cols-[60%_20%_20%]">
            <div className="flex flex-col">
              <span className="font-medium truncate">Neveikia internetas</span>
              <span className="text-gray-500 text-xs">Problema</span>
            </div>
            <div className="">
              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  'uzdaryta'
                )}`}
              >
                Uždaryta
              </span>
            </div>
            <div className="">
              <span className="text-xs text-gray-500">2025-01-01</span>
            </div>
          </li>
          {/*  */}
          {/*  */}
          {/* Task 3 */}
          <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md grid grid-cols-[60%_20%_20%]">
            <div className="flex flex-col">
              <span className="font-medium truncate">Neveikia internetas</span>
              <span className="text-gray-500 text-xs">Peoblema</span>
            </div>
            <div className="">
              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  'uzdaryta'
                )}`}
              >
                Uždaryta
              </span>
            </div>
            <div className="">
              <span className="text-xs text-gray-500">2025-01-01</span>
            </div>
          </li>
          <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md grid grid-cols-[60%_20%_20%]">
            <div className="flex flex-col">
              <span className="font-medium truncate">Neveikia internetas</span>
              <span className="text-gray-500 text-xs">Peoblema</span>
            </div>
            <div className="">
              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  'uzdaryta'
                )}`}
              >
                Uždaryta
              </span>
            </div>
            <div className="">
              <span className="text-xs text-gray-500">2025-01-01</span>
            </div>
          </li>
          <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md grid grid-cols-[60%_20%_20%]">
            <div className="flex flex-col">
              <span className="font-medium truncate">Neveikia internetas</span>
              <span className="text-gray-500 text-xs">Peoblema</span>
            </div>
            <div className="">
              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  'uzdaryta'
                )}`}
              >
                Uždaryta
              </span>
            </div>
            <div className="">
              <span className="text-xs text-gray-500">2025-01-01</span>
            </div>
          </li>
          <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md grid grid-cols-[60%_20%_20%]">
            <div className="flex flex-col">
              <span className="font-medium truncate">Neveikia internetas</span>
              <span className="text-gray-500 text-xs">Peoblema</span>
            </div>
            <div className="">
              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  'uzdaryta'
                )}`}
              >
                Uždaryta
              </span>
            </div>
            <div className="">
              <span className="text-xs text-gray-500">2025-01-01</span>
            </div>
          </li>
          <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md grid grid-cols-[60%_20%_20%]">
            <div className="flex flex-col">
              <span className="font-medium truncate">Neveikia internetas</span>
              <span className="text-gray-500 text-xs">Peoblema</span>
            </div>
            <div className="">
              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  'uzdaryta'
                )}`}
              >
                Uždaryta
              </span>
            </div>
            <div className="">
              <span className="text-xs text-gray-500">2025-01-01</span>
            </div>
          </li>
          <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md grid grid-cols-[60%_20%_20%]">
            <div className="flex flex-col">
              <span className="font-medium truncate">Neveikia internetas</span>
              <span className="text-gray-500 text-xs">Peoblema</span>
            </div>
            <div className="">
              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  'uzdaryta'
                )}`}
              >
                Uždaryta
              </span>
            </div>
            <div className="">
              <span className="text-xs text-gray-500">2025-01-01</span>
            </div>
          </li>
          <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md grid grid-cols-[60%_20%_20%]">
            <div className="flex flex-col">
              <span className="font-medium truncate">Neveikia internetas</span>
              <span className="text-gray-500 text-xs">Peoblema</span>
            </div>
            <div className="">
              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  'uzdaryta'
                )}`}
              >
                Uždaryta
              </span>
            </div>
            <div className="">
              <span className="text-xs text-gray-500">2025-01-01</span>
            </div>
          </li>
          {/*  */}
        </ul>
      </div>
    </div>
  );
}
