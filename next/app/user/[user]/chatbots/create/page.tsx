import type { NextPage } from 'next';
import Navbar from '../../../../ui/navbar';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CreateComponent from './form';

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
      <CreateComponent username={username}/>
    </div>
  );
}

export default UserHomePage;