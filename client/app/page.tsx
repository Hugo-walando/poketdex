import MaxWidthWrapper from './components/layout/MaxWidthWrapper';
import Button from './components/ui/Button';
import Input from './components/ui/Input';

export default function Home() {
  return (
    <MaxWidthWrapper>
      Home
      <div className='mx-40 my-40 py-[100px] px-[100px] bg-white rounded-md shadow-base'>
        <Button variant='primary'>Connexion</Button>
        <Button variant='danger'>Supprimer</Button>
        <Button variant='secondary'>Annuler</Button>
        <Input label='Nom' placeholder='Entrez votre nom' />
      </div>
    </MaxWidthWrapper>
  );
}
