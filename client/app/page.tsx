'use client';

import { useState } from 'react';
import MaxWidthWrapper from './components/layout/MaxWidthWrapper';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Modal from './components/ui/Modal';

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  const handleSendTrade = () => {
    console.log('Demande envoyé !');
    setShowModal(false); // ← ferme le modal
  };
  return (
    <MaxWidthWrapper>
      Home
      <div className='mx-40 my-40 py-[100px] px-[100px] bg-white rounded-md shadow-base'>
        <Button variant='primary' onClick={() => setShowModal(true)}>
          Echanger
        </Button>
        <Button variant='danger'>Supprimer</Button>
        <Button variant='secondary'>Annuler</Button>
        <Input label='Nom' placeholder='Entrez votre nom' />
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title='Proposer l’échange ?'
        >
          <p className='text-gray-base mb-4 text-center'>
            Êtes-vous sûr de vouloir proposer l`échange ?
          </p>
          <div className='flex justify-center gap-2'>
            <Button variant='secondary' onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant='primary' onClick={handleSendTrade}>
              Confirmer
            </Button>
          </div>
        </Modal>
      </div>
    </MaxWidthWrapper>
  );
}
