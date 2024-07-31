import type { NextPage } from 'next';
import Navbar from '../../../ui/navbar';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Dashboard from './chatbots_dashboard';
const UserHomePage: NextPage = () => {
  const cookieStore = cookies()
  const cookieObject = cookieStore.get('username')
  const username = cookieObject ? cookieObject.value : 'undefined';

  if (username=='undefined'){
    redirect('/')
  }

  return (
    <div>
      <Navbar username={username}/>
      <Dashboard/>
    </div>
  );
}

export default UserHomePage;