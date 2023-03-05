/**
 * Tasks popup modal component used for adding & editing tasks
 * 
 * @param {*} props
 * @returns 
 */
export default function TaskModal({
  modalState,
  editRecordData,
  toggleModalState,
  formRenderData,
  relationData,
  setFormData
}) {
  // Handles popup modal form submission
  const handleSubmit = (e, relationData = null) => {
    // Avoid submitting data to the url which reloads the page
    e.preventDefault()
    // Create an empty data object to store form data in there
    var data = {}
    // If an id element is present in form that means we are editing a record
    // So add the id to the data object as well
    if (e.target.id) {
      data.id = e.target.id.value
    }
    // Add all of the fields from the form
    data.title = e.target.title.value
    data.content = e.target.content.value
    data.due_date = e.target.dueDate.value
    data.cover_photo = e.target.coverPhoto.value
    data.category = e.target.category.value
    // Add the relationData passed under the props as well
    if (relationData) {
      data = { ...data, ...relationData }
    }
    // Pass the data under the callback function passed to the component under props
    setFormData(data)
  }
  return (
    <div
      className={`relative z-10 ease-in duration-200 ${modalState.modalHide ? ` hidden ` : ``
        } ${modalState.modalVisible ? `opacity-100` : `opacity-0`}`}
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>
      <div className='fixed inset-0 z-10 overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <div
            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg
          ${modalState.modalVisible
                ? `opacity-100 translate-y-0 sm:scale-100`
                : `opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`
              }`}
          >
            <form
              action='#'
              method='POST'
              onSubmit={(e) => handleSubmit(e, relationData)}
            >
              {editRecordData ? <input type="hidden" name="id" defaultValue={editRecordData.id} /> : ''}
              <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6'>
                <span className='text-lg font-medium'>{editRecordData ? 'Edit Task' : 'Add Task'}</span>
              </div>
              <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='mt-5 md:col-span-2 md:mt-0'>
                  <div className='grid grid-cols-6 gap-6'>
                    <div className='col-span-6'>
                      <label
                        htmlFor='title'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Title
                      </label>
                      <input
                        type='text'
                        name='title'
                        id='title'
                        placeholder='Title'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        defaultValue={editRecordData ? editRecordData.attributes.title : ''}
                        required='required'
                      />
                    </div>

                    <div className='col-span-6'>
                      <label
                        htmlFor='content'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Content
                      </label>
                      <textarea
                        id='content'
                        name='content'
                        rows='3'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        placeholder='Task content goes here...'
                        defaultValue={editRecordData ? editRecordData.attributes.content : ''}
                        required='required'
                      ></textarea>
                    </div>

                    <div className='col-span-6'>
                      <label
                        htmlFor='dueDate'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Due Date
                      </label>
                      <input
                        type='date'
                        name='dueDate'
                        id='dueDate'
                        placeholder='Due date'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        defaultValue={editRecordData ? editRecordData.attributes.due_date : ''}
                        required='required'
                      />
                    </div>

                    <div className='col-span-6'>
                      <label
                        htmlFor='category'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Category
                      </label>
                      <select
                        id='category'
                        name='category'
                        className='mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                        value={editRecordData && editRecordData.attributes.category.data.id ? editRecordData.attributes.category.data.id : 1}
                      >
                        {formRenderData.categories.map((category) => (
                          <option value={category.id} key={category.id}>{category.attributes.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className='col-span-6' key={'coverPhoto'}>
                      <label className='block text-sm font-medium text-gray-700'>
                        Cover Photo
                      </label>
                      <div className='mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6'>
                        <div className='space-y-1 text-center'>
                          <svg
                            className='mx-auto h-12 w-12 text-gray-400'
                            stroke='currentColor'
                            fill='none'
                            viewBox='0 0 48 48'
                            aria-hidden='true'
                          >
                            <path
                              d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <div className='flex text-sm text-gray-600'>
                            <label
                              htmlFor='file-upload'
                              className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500'
                            >
                              <span>Upload a file</span>
                              <input
                                id='file-upload'
                                name='coverPhoto'
                                type='file'
                                className='sr-only'
                              />
                            </label>
                            <p className='pl-1'>or drag and drop</p>
                          </div>
                          <p className='text-xs text-gray-500'>
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                <button
                  type='submit'
                  className='inline-flex w-full justify-center rounded-md border border-transparent bg-pink-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  {editRecordData ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={() => toggleModalState()}
                  type='button'
                  className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
