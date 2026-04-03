import SummaryCards from '../components/dashboard/SummaryCards'
import BalanceTrend from '../components/dashboard/BalanceTrend'
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown'
import RecentTransactions from '../components/dashboard/RecentTransactions'

export default function Dashboard({ onNavigate }) {
  return (
    <div className="space-y-6">
      <SummaryCards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <BalanceTrend />
        </div>
        <div>
          <SpendingBreakdown />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentTransactions onViewAll={() => onNavigate('transactions')} />
      </div>
    </div>
  )
}
