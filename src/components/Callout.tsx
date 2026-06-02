
interface CalloutProps {
  title: string;
  description: string;
}

const Callout = ({ title, description }: CalloutProps) => {
  return (
    <div className='flex flex-col gap-0.5 px-2 py-2 bg-callout-bg border-l-4 border-l-callout-border'>
      <h3 className='font-bold text-callout-text'>{title}</h3>
      <p className='text-sm text-callout-text'>{description}</p>
    </div>
  );
};

export default Callout;