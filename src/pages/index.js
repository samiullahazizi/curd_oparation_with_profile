import styles from '../app/page.module.css'
import { useEffect, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop'
import * as Yup from 'yup';
import { Formik } from 'formik';
import ReactLoading from 'react-loading'
import getCroppedImg from 'components/cropimage';
import Request from 'components/request';
function Index() {
    const [Add_User, setAdd_User] = useState(false)
    const [Edit_User, setEdit_User] = useState()

    const [Profile, setProfile] = useState()
    const [ErrorProfilePhoto, setErrorProfilePhoto] = useState("")
    const [loading, setLoading] = useState(false)
    const [Users, setUsers] = useState(false)

    useEffect(() => {
        Request.make_request_get('test', setUsers)

    }, [])

    //image croption
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async (values) => {
        try {
            const croppedImage = await getCroppedImg(
                Profile,
                croppedAreaPixels,
                rotation
            )
            console.log('donee', { croppedImage })
            setCroppedImage(croppedImage)

            setAdd_User(false)
            setProfile()
            values.photo = croppedImage
            if(Edit_User){
                if(Edit_User.id){
                    values.id =Edit_User.id
                    Request.make_request_post("test/update", values, Handle_Add_Result, true)

           
                }else{
                    Request.make_request_post("test", values, Handle_Add_Result, true)

                }
            }else{
                Request.make_request_post("test", values, Handle_Add_Result, true)

            }


            console.log(values)
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels, rotation])

    let DataValidation = Yup.object().shape({
        name: Yup.string().required(),
        lastname: Yup.string().required(),
        gender: Yup.string().required(),
        password: Yup.string().required(),
        username: Yup.string().required(),
        department: Yup.string().required(),
        date_of_birth: Yup.date().required().min("1919-11-13"),
        job: Yup.string().required().nullable(),
        email: Yup.string().email(),

    });

    const Handle_Add_Result = (e) => {
        setLoading(false)
        setAdd_User(false)
        Request.make_request_get('test', setUsers)
        if (e) {
            console.log(e)
       
           
        }
    }
    return (
        <main className="bg-[#F7FAFF]" style={{minHeight:"100vh"}} >
            <div className={" flex justify-between p-8"}>
                <p onClick={() => { setAdd_User(true) }} className='text-white font-semibold bg-blue-500 cursor-pointer py-2 px-4 rounded'>
                    Add User

                </p>
                <div>
                    <a
                        href="https://github.com/samiullahazizi"
                        target="_blank"
                        className='font-medium text-gray-900'
                        rel="noopener noreferrer"
                    >
                        By{' '}
                        Samiullah Azizi
                    </a>
                </div>
            </div>
            {/* <div className='text-red-500'>
          aklsdfj sadf
        </div> */}
            <div>
                <div className="relative overflow-x-auto shadow-sm sm:rounded-lg p-5">
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 overflow-scroll" >
                        <thead className="bg-gray-50 border">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Gender
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Department
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Job
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Date of Birth
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                            {Users && Users.map((el, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                                        <div className="relative h-10 w-10">
                                            <img
                                                className="h-full w-full rounded-full object-cover object-center"
                                                src={"https://career.afganturkmaarif.org/test2/api/test/file?file=" + el.photo}
                                                alt=""
                                            />
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-700">{el.name} {el.lastname}</div>
                                            <div className="text-gray-400">{el.email}</div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                                            {el.gender}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{el.department}</td>
                                    <td className="px-6 py-4">
                                        {el.job}
                                    </td>
                                    <td className="px-6 py-4">
                                        {el.date_of_birth}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-4">
                                            <p  className='cursor-pointer' onClick={()=>{
                                                setLoading(true)
                                                var user = Users
                                                user.splice(index, 1);
                                                setUsers(user)
                                                Request.make_request_post("test/delete/"+el.id,{},Handle_Add_Result,true)
                                            }} >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                    x-tooltip="tooltip"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                    />
                                                </svg>
                                            </p>
                                            <p  className='cursor-pointer'
                                            onClick={()=>{setEdit_User(el);setAdd_User(true)}} >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                    x-tooltip="tooltip"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                                    />
                                                </svg>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                </div>


            </div>


            {Add_User && Add_User == true && <div>

                <div className="fixed top-0 left-0  w-full h-full overflow-x-hidden overflow-y-auto outline-none pt-8 z-50 " >
                    <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={() => { setAdd_User(false); setProfile();setEdit_User() }}   ></div>
                    <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-5/6 max-w-6xl mx-auto relative  rounded mb-11  z-50 bg-white  shadow-xl">
                        <div className='flex justify-between items-center rounded-t bg-gray-100 font-medium text-gray-900 p-4'>
                            <h5 className='font-semibold'>{ Edit_User && Edit_User.id ? "Edit":"Add"} User</h5>
                            <button type="button" onClick={() => { setAdd_User(false); setProfile();setEdit_User()  }} className="font-bold  text-gray-900" data-dismiss="modal" aria-label="Close">
                                <span className='font-bold' aria-hidden="true">×</span>
                            </button>
                        </div>
                        <Formik
                            initialValues={
                                Edit_User ? {
                                    name:Edit_User.name,
                                    lastname: Edit_User.lastname,
                                    username: Edit_User.username,
                                    password: Edit_User.password,
                                    gender: Edit_User.gender,
                                    department:Edit_User.department,
                                    date_of_birth: Edit_User.date_of_birth,
                                    job: Edit_User.job,
                                    email: Edit_User.email,

                                } : {
                                   
                                    name: "",
                                    lastname: "",
                                    username: "",
                                    password: "",
                                    gender: "Male",
                                    department: "",
                                    date_of_birth: "",
                                    job: "",
                                }
                            }
                            validationSchema={DataValidation}
                            onSubmit={(values, { setSubmitting }) => {

                                if (ErrorProfilePhoto != "") {
                                    return false
                                }

                                if (Profile) {
                                    showCroppedImage(values)
                                    setLoading(true)
                                    return false
                                } else {
                                    if(Edit_User){
                                        if(Edit_User.id){
                                            values.id =Edit_User.id

                                            Request.make_request_post("test/update", values, Handle_Add_Result, true)
                                            setLoading(true)

                                            return false
                                        }
                                    }
                                    Request.make_request_post("test", values, Handle_Add_Result, true)
                                    setLoading(true)
                                }
                                setTimeout(() => {
                                    setSubmitting(false);
                                }, 400);
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                <form id="AddStudentForm" method="POST" onSubmit={handleSubmit} className="" encType="multipart/form-data">
                                    <div className='p-4'>
                                        <div className="grid grid-cols-1 gap-4 mt-2  ">
                                            {Profile && <div className="relative h-96 w-full">

                                                <Cropper
                                                    image={Profile}
                                                    crop={crop}
                                                    rotation={rotation}
                                                    aspect={4 / 4}
                                                    onCropChange={setCrop}
                                                    onRotationChange={setRotation}
                                                    onCropComplete={onCropComplete}

                                                />

                                            </div>}

                                        </div>
                                        <div className=" grid grid-cols-2 gap-4 mt-2 ">
                                            <div className="">
                                                <label htmlFor="name" className='text-[#22184691]'>Name</label><input type="text" onChange={handleChange} onBlur={handleBlur} value={values.name} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Name" name="name" id="name" />
                                                <label htmlFor="" className="block mb-1 text-sm  text-red-500 ">
                                                    {errors.name && touched.name && errors.name}
                                                </label>
                                            </div>
                                            <div className="">
                                                <label htmlFor="lastname" className='text-[#22184691]'>Last Name</label><input onChange={handleChange} onBlur={handleBlur} value={values.lastname} type="text" placeholder="Last Name" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="lastname" id="lastname" />
                                                <label htmlFor="" className="block mb-1 text-sm  text-red-500 ">
                                                    {errors.lastname && touched.lastname && errors.lastname}
                                                </label>
                                            </div>
                                        </div>
                                        <div className=" grid grid-cols-2 gap-4 mt-2 ">

                                            <div className="">
                                                <label htmlFor="username" className='text-[#22184691]'>Username</label><input type="text" placeholder='username' onChange={handleChange} onBlur={handleBlur} value={values.username} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="username" id="username" />
                                                <label htmlFor="" className="block mb-1 text-sm  text-red-500 ">
                                                    {errors.username && touched.username && errors.username}
                                                </label>
                                            </div>
                                            <div className="">
                                                <label htmlFor="password" className='text-[#22184691]'>Password</label><input type="password" onChange={handleChange} onBlur={handleBlur} value={values.password} placeholder='******' className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="password" id="password" />
                                                <label htmlFor="" className="block mb-1 text-sm  text-red-500 ">
                                                    {errors.password && touched.password && errors.password}
                                                </label>
                                            </div>
                                        </div>



                                        <div className=" grid grid-cols-2 gap-4 mt-2 ">

                                            <div className="">
                                                <label htmlFor="gender" className='text-[#22184691]'>Gender</label>
                                                <select name="gender" onChange={handleChange} onBlur={handleBlur} value={values.gender} id="gender" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                                <label htmlFor="" className="block mb-1 text-sm  text-red-500 ">
                                                    {errors.gender && touched.gender && errors.gender}
                                                </label>
                                            </div>

                                            <div className="">
                                                <label htmlFor="department" className='text-[#22184691]'>Department</label><input onChange={handleChange} onBlur={handleBlur} value={values.department} type="text" placeholder='Department' className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="department" id="department" />
                                                <label htmlFor="" className="block mb-1 text-sm  text-red-500 ">
                                                    {errors.department && touched.department && errors.department}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-2  ">
                                            <div className="">
                                                <label htmlFor="date_of_birth" className='text-[#22184691]'>Date of Birth</label><input onChange={handleChange} onBlur={handleBlur} value={values.date_of_birth} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Date of Birth" type="date" name="date_of_birth" id="date_of_birth" />
                                                <label htmlFor="" className="block mb-1 text-sm  text-red-500 ">
                                                    {errors.date_of_birth && touched.date_of_birth && errors.date_of_birth}
                                                </label>
                                            </div>
                                            <div className="">
                                                <label htmlFor="job" className='text-[#22184691]'>Job</label><input type="text" onChange={handleChange} onBlur={handleBlur} value={values.job} placeholder='Job' className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="job" id="job" />
                                                <label htmlFor="" className="block mb-1 text-sm  text-red-500 ">
                                                    {errors.job && touched.job && errors.job}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 mt-2  ">
                                            <div className="">
                                                <label htmlFor="email" className='text-[#22184691]'>Email</label><input onChange={handleChange} onBlur={handleBlur} value={values.email} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Email" type="email" name="email" id="email" />
                                                <label htmlFor="" className="block mb-1 text-sm  text-red-500 ">
                                                    {errors.email && touched.email && errors.email}
                                                </label>
                                            </div>

                                        </div>

                                        <div className="grid grid-cols-1 gap-4 mt-2  ">
                                            <div className="">
                                                <label htmlFor="photo" className='text-[#22184691]'>Photo</label><input
                                                    onChange={(e) => {
                                                        const image = e.target.files[0];
                                                        if (!image) {
                                                            console.log('image is required');
                                                            return false;
                                                        }
                                                        if (!image.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
                                                            console.log('select valid image.');
                                                            setErrorProfilePhoto("Only support( .jpg | .jpeg | .gif | .png  )")
                                                            return false;
                                                        } else {
                                                            if (image.size / 1024 / 1024 > 5) {
                                                                setErrorProfilePhoto(t("The file size is too large. File size must be less than 5 MB"))
                                                                return false;

                                                            }
                                                        }
                                                        setErrorProfilePhoto("")
                                                        setProfile(URL.createObjectURL(e.target.files[0]))
                                                    }}
                                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" type="file" name="photo" id="photo" />
                                                <label htmlFor="" className="block mb-1 text-sm  text-red-500 ">
                                                    {ErrorProfilePhoto && ErrorProfilePhoto}

                                                </label>
                                            </div>

                                        </div>




                                    </div>
                                    <div className="flex flex-row items-center justify-between px-5 py-2 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
                                        <p className="font-semibold text-gray-600 cursor-pointer hover:underline" onClick={() => { setAdd_User({ visible: false }); setProfile();setEdit_User()  }} >Cancel</p>
                                        <button type='submit' className="px-4 py-2 text-white font-semibold bg-blue-500 rounded">
                                        { Edit_User ? "Edit":"Add"}
                                        </button>

                                    </div></form>)}
                        </Formik>
                    </div>
                    <div className='h-14'></div>
                </div>
            </div>
            }
            {loading && loading == true && <div>
                <div className="fixed top-0 left-0  w-full h-full overflow-x-hidden overflow-y-auto outline-none z-[100] " >
                    <div>   <div className='text-center h-screen grid content-center bg-[#F7FAFF] bg-opacity-30'><h4 className='text-5xl text-[#8a8989]'>Loading <ReactLoading className='mx-auto w-8 h-8' type={'bubbles'} color={'#00adbb'} width={64} height={64} /></h4></div></div>
                </div>
            </div>}

        </main>);
}

export default Index;