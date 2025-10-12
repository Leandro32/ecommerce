import EditProductForm from './EditProductForm';

export default async function EditProductPage(props: { params: { id: string } }) {
  const { id } = props.params;
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update the details of the product.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <EditProductForm productId={id} />
      </div>
    </div>
  );
}