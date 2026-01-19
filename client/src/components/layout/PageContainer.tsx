type Props = {
  children: React.ReactNode;
};

const PageContainer = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div
        className="
          mx-auto max-w-6xl
          bg-white
          rounded-3xl
          border border-slate-200
          shadow-[0_1px_2px_rgba(0,0,0,0.06)]
          p-6 md:p-10
        "
      >
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
