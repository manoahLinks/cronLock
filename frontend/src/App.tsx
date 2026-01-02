import { ResourceContainer } from './containers/ResourceContainer';

import LockerPayment from './containers/LockContainer';

const API_BASE = import.meta.env.VITE_API_BASE as string;

export default function App(): JSX.Element {
  return <LockerPayment/>;
}
