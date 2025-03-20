import Button from './components/ui/Button';

export default function Home() {
  return (
    <div>
      Home
      <div className='mx-40 my-40 py-[100px] px-[100px] bg-white rounded-md shadow-base'>
        <Button variant='primary'>Connexion</Button>
        <Button variant='danger'>Supprimer</Button>
        <Button variant='secondary'>Annuler</Button>
      </div>
    </div>
  );
}
