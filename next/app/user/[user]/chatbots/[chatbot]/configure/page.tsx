import type { NextPage } from 'next';
import Navbar from '@/app/ui/navbar';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Form from './form';

const FormPage: NextPage = () => {
  const cookieStore = cookies()

  const cookieObject = cookieStore.get('username')
  const username = cookieObject ? cookieObject.value : 'undefined';

  if (username=='undefined'){
    redirect('/')
  }

  return (
    <div>
      <Navbar username={username}/>
      <Form username={username}/>
    </div>
  );
}

export default FormPage;