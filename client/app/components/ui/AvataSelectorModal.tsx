'use client';

import Image from 'next/image';
import Modal from './Modal';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  selectedAvatar: string;
  onClose: () => void;
  onSelect: (avatar: string) => void;
  onSave: () => void;
}

export default function AvatarSelectorModal({
  isOpen,
  selectedAvatar,
  onClose,
  onSelect,
  onSave,
}: AvatarSelectorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Choisis ton avatar'>
      <div className='grid grid-cols-4 gap-3 max-h-[250px] overflow-y-auto'>
        {[...Array(5)].map((_, i) => {
          const path = `/avatars/Av${i + 1}.png`;
          return (
            <Image
              key={path}
              src={path}
              width={0}
              height={0}
              sizes='100vw'
              alt={`Avatar ${i + 1}`}
              onClick={() => onSelect(path)}
              className={`w-16 h-16 rounded-full cursor-pointer border-4 ${
                selectedAvatar === path
                  ? 'border-primarygreen'
                  : 'border-transparent'
              }`}
            />
          );
        })}
      </div>

      <button
        onClick={onSave}
        className='mt-4 w-full py-2 bg-primarygreen text-white rounded-xl hover:bg-primarygreen/80'
      >
        Sauvegarder l’avatar
      </button>
    </Modal>
  );
}
