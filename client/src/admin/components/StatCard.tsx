// admin/components/StatCard.tsx
type Props = {
  label: string;
  value: number | string;
};

const StatCard = ({ label, value }: Props) => {
  return (
    <div className="rounded-lg flex flex-col gap-2 justify-center items-center border border-gray-200 bg-white p-6 shadow-sm ">
      <div className="text-5xl font-black text-blue-900">
        {value}
      </div>
      <div className="mt-1 text-xl font-medium text-gray-500">
        {label}
      </div>
    </div>
  );
};

export default StatCard;
