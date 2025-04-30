
interface CalloutProps {
  title: string;
  description: string;
}

const Callout = ({ title, description }: CalloutProps) => {
  return (
    <div className='flex flex-col gap-0.5 px-2 py-2 bg-[#F0FDFA] border-l-4 border-l-[#00D5BE]'>
      <h3 className='font-bold text-[#005F5A]'>{title}</h3>
      <p className='text-sm text-[#005F5A]'>{description}</p>
    </div>
  );
};

export default Callout;