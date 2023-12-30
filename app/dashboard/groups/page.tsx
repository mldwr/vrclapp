export default function Page() {
    return <p>Groups Page</p>;
} 
/* 
import { useAdminRole } from '../../../auth';

export default function AdminPage() {
  const isAdmin = useAdminRole();

  if (!isAdmin) {
    return <div>Unauthorized Access</div>;
  }

  return (
    <div>
      <h1>Admin Page</h1>
    </div>
  );
} */