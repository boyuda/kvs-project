import SummaryCardItem from './SummaryCardItem';
import Loading from './spiner';
import {
  getNewTasksCount,
  getNewSalesCount,
  getSalesAmountTotal,
  getClosedTasksCount,
} from '@/src/services/supabase/client/reports';
import { useState, useEffect } from 'react';
import {
  RectangleStackIcon,
  CurrencyEuroIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function SummaryCards({ filters }) {
  const [taskCount, setTaskCount] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [salesAmount, setSalesAmount] = useState(null);
  const [closedTaskCount, setClosedTaskCount] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const [taskCount, sales, salesAmount, closed] = await Promise.all([
        getNewTasksCount(filters),
        getNewSalesCount(filters),
        getSalesAmountTotal(filters),
        getClosedTasksCount(filters),
      ]);

      setTaskCount(taskCount);
      setSalesData(sales);
      setSalesAmount(salesAmount);
      setClosedTaskCount(closed);
    }

    fetchStats();
  }, [filters]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCardItem
        label="Naujos užduotys"
        value={taskCount !== null ? taskCount : <Loading />}
        sublabel={
          filters.dateRange.from === filters.dateRange.to
            ? `${filters.dateRange.from} dienos sukurtos užduotys`
            : `Užduotys sukurtos tarp ${filters.dateRange.from} ir ${filters.dateRange.to}`
        }
        icon={<RectangleStackIcon />}
      />
      <SummaryCardItem
        label="Naujos paslaugos / Sutarties atnaujinimai"
        value={
          salesData ? (
            `${salesData.newServices} / ${salesData.renewals}`
          ) : (
            <Loading />
          )
        }
        sublabel={
          filters.dateRange.from === filters.dateRange.to
            ? `${filters.dateRange.from} dienos pardavimai`
            : `Pardavimai tarp ${filters.dateRange.from} ir ${filters.dateRange.to}`
        }
        icon={<ClipboardDocumentCheckIcon />}
      />

      <SummaryCardItem
        label="Pardavimų suma (€)"
        value={
          salesAmount !== null ? `${salesAmount.toFixed(2)} €` : <Loading />
        }
        sublabel={
          filters.dateRange.from === filters.dateRange.to
            ? `${filters.dateRange.from} dienos pardavimų suma`
            : `Pardavimų suma tarp ${filters.dateRange.from} ir ${filters.dateRange.to}`
        }
        icon={<CurrencyEuroIcon className="w-5 h-5" />}
      />

      <SummaryCardItem
        label="Uždarytos užduotys"
        value={closedTaskCount ?? <Loading />}
        sublabel={
          filters.dateRange.from === filters.dateRange.to
            ? `${filters.dateRange.from} dieną uždarytos užduotys`
            : `Užduotys uždarytos tarp ${filters.dateRange.from} ir ${filters.dateRange.to}`
        }
        icon={<CheckCircleIcon className="w-5 h-5" />}
      />
    </div>
  );
}
