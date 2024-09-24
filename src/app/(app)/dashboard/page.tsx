import dynamic from 'next/dynamic';

const DynamicUserDashboard = dynamic(() => import('./DashboardUi'), { ssr: false });

function YourPage() {
  return (
    <div>
      <DynamicUserDashboard />
    </div>
  );
}

export default YourPage;
