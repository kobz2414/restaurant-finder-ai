type CategoryProps = {
  category: string;
};

const Category = ({ category }: CategoryProps) => {
  return (
    <>
      <div className="flex w-fit py-1 px-3 bg-blue-600 text-white rounded-full">
        <p className="text-xs">{category}</p>
      </div>
    </>
  );
};

export default Category;
