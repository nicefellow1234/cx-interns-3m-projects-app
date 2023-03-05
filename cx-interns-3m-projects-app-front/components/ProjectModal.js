/**
 * Projects popup modal component used for adding project
 * 
 * @param {*} props
 * @returns 
 */
export default function ProjectModal({
    modalState,
    toggleModalState,
    relationData,
    setFormData
}) {
    // Handles popup modal form submission
    const handleSubmit = (e, relationData = null) => {
        // Avoid submitting data to the url which reloads the page
        e.preventDefault()
        // Create an empty data object to store form data in there
        var data = {}
        data.title = e.target.title.value
        data.description = e.target.description.value
        data.abbreviation = e.target.abbreviation.value
        // Pass the data under the callback function passed to the component under props
        setFormData(data)
        // Reset the form for new record adding
        e.target.reset()
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
                            <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6'>
                                <span className='text-lg font-medium'>Add Project</span>
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
                                                required='required'
                                            />
                                        </div>

                                        <div className='col-span-6'>
                                            <label
                                                htmlFor='description'
                                                className='block text-sm font-medium text-gray-700'
                                            >
                                                Description
                                            </label>
                                            <textarea
                                                id='description'
                                                name='description'
                                                rows='3'
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                                                placeholder='Project description goes here...'
                                                required='required'
                                            ></textarea>
                                        </div>

                                        <div className='col-span-6'>
                                            <label
                                                htmlFor='abbreviation'
                                                className='block text-sm font-medium text-gray-700'
                                            >
                                                Abbreviation
                                            </label>
                                            <input
                                                type='text'
                                                name='abbreviation'
                                                id='abbreviation'
                                                placeholder='Abbreviation'
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                                                required='required'
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                                <button
                                    type='submit'
                                    className='inline-flex w-full justify-center rounded-md border border-transparent bg-pink-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
                                >
                                    Add
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
