import { cn } from '@/app/utils/cn';

interface FiltersWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const FiltersWrapper = ({ children, className }: FiltersWrapperProps) => {
  return <div className={cn('mb-10 md:flex gap-6', className)}>{children}</div>;
};

export default FiltersWrapper;
