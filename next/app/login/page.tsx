import type { NextPage } from 'next';
import Navbar from '../ui/navbar';
import { cookies } from 'next/headers'
import LoginPage from './form';

const UserHomePage: NextPage = () => {
  const cookieStore = cookies()
  const cookieObject = cookieStore.get('username')
  const username = cookieObject ? cookieObject.value : 'undefined';

  return (
    <div>
      <Navbar username={username}/>
      <LoginPage/>
    </div>
  );
}

export default UserHomePage;