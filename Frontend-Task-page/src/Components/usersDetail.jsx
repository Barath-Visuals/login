//import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import Calendar from './CalendarModal.jsx';
import axios from 'axios';
import { useFetcher } from 'react-router-dom';
import styles from "../StyleSCSS/userdetail.module.scss"

export default function ShowUserDetails ({user}) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [userDetail, setUserDetail] = useState(user);
    const [selectedUsername, setSelectedUsername] = useState(null);

    useEffect(() => {
        if (user) {
            setEditedUser({ ...user });
        }
    }, [user]);

    useEffect(() => {
        setUserDetail(user);

    }, [user])

    const handleChange = (e) => {
        setEditedUser({...editedUser, [e.target.name]: e.target.value});
    }

    const handleOpenCalendar = (username) => {
        setSelectedUsername(username);
        setShowCalendar(true);
    }

    const handleCloseCalendar = () => {
        setShowCalendar(false);
        setSelectedUsername(null)
    }

    const handleSave = async() => {
        try{
            const payload = {
                username : editedUser.username,
                name : editedUser.name,
                age : editedUser.age,
                phone: editedUser.phone,
                address : editedUser.address,
                aadhaar : editedUser.aadhaar || "",
            }

            await axios.post(`http://localhost:8000/admin/profile/update`, payload,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            alert("user details updated")
            setIsEditing(false)
            setUserDetail({ ...editedUser })
        } catch (error) {
            console.error("failed", error)
        }
    }

    if (!editedUser) return null
    return (
        <div className={styles.content_container}>
            <div className={styles.container_content}>
                <div className={styles.user_section}>
                    <span className={styles.card_title}>Staff Details</span>
                    {isEditing ? (
                        <>
                            <div className={styles.header}>
                                <input placeholder='Name' name='name' value={editedUser.name || ''} onChange={handleChange}/>
                                <input placeholder='Age' name='age' value={editedUser.age || ''} onChange={handleChange}/>
                                <input placeholder='Phone' name='phone' value={editedUser.phone || ''} onChange={handleChange}/>
                                <input placeholder='Address' name='address' value={editedUser.address || ''} onChange={handleChange}/>
                                <input placeholder='Aadhaar' name='aadhaar' value={editedUser.aadhaar || ''} onChange={handleChange}/>
                            </div>

                        </>
                    ): (
                        <>
                            <div className={styles.detailspara}>
                                <div className={styles.card__icon}>
                                    <span className={styles.card__title}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                                            <path d="M1 13.4487C1 12.5205 1.36875 11.6302 2.02513 10.9739C2.6815 10.3175 3.57174 9.94873 4.5 9.94873H11.5C12.4283 9.94873 13.3185 10.3175 13.9749 10.9739C14.6313 11.6302 15 12.5205 15 13.4487C15 13.9129 14.8156 14.358 14.4874 14.6862C14.1592 15.0144 13.7141 15.1987 13.25 15.1987H2.75C2.28587 15.1987 1.84075 15.0144 1.51256 14.6862C1.18437 14.358 1 13.9129 1 13.4487Z" stroke="black" stroke-linejoin="round"/>
                                            <path d="M8 6.44873C9.44975 6.44873 10.625 5.27348 10.625 3.82373C10.625 2.37398 9.44975 1.19873 8 1.19873C6.55025 1.19873 5.375 2.37398 5.375 3.82373C5.375 5.27348 6.55025 6.44873 8 6.44873Z" stroke="black"/>
                                        </svg>
                                    </span>
                                    <p>{userDetail.name}</p>
                                </div>
                                <div className={styles.card__icon}>
                                    <span className={styles.card__title}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17" fill="none">
                                            <path d="M14 1.79873H11.6V0.59873C11.6 0.492644 11.5579 0.390902 11.4828 0.315888C11.4078 0.240873 11.3061 0.19873 11.2 0.19873C11.0939 0.19873 10.9922 0.240873 10.9172 0.315888C10.8421 0.390902 10.8 0.492644 10.8 0.59873V1.79873H5.2V0.59873C5.2 0.492644 5.15786 0.390902 5.08284 0.315888C5.00783 0.240873 4.90609 0.19873 4.8 0.19873C4.69391 0.19873 4.59217 0.240873 4.51716 0.315888C4.44214 0.390902 4.4 0.492644 4.4 0.59873V1.79873H2C1.46976 1.79937 0.961423 2.01028 0.586488 2.38522C0.211553 2.76015 0.000635143 3.26849 0 3.79873V14.1987C0.000635143 14.729 0.211553 15.2373 0.586488 15.6122C0.961423 15.9872 1.46976 16.1981 2 16.1987H14C14.5304 16.1987 15.0391 15.988 15.4142 15.6129C15.7893 15.2379 16 14.7292 16 14.1987V3.79873C16 3.2683 15.7893 2.75959 15.4142 2.38452C15.0391 2.00944 14.5304 1.79873 14 1.79873ZM15.2 14.1987C15.2 14.517 15.0736 14.8222 14.8485 15.0473C14.6235 15.2723 14.3183 15.3987 14 15.3987H2C1.68174 15.3987 1.37652 15.2723 1.15147 15.0473C0.926428 14.8222 0.8 14.517 0.8 14.1987V7.39873H15.2V14.1987ZM15.2 6.59873H0.8V3.79873C0.8 3.13633 1.336 2.59873 2 2.59873H4.4V3.79873C4.4 3.90482 4.44214 4.00656 4.51716 4.08157C4.59217 4.15659 4.69391 4.19873 4.8 4.19873C4.90609 4.19873 5.00783 4.15659 5.08284 4.08157C5.15786 4.00656 5.2 3.90482 5.2 3.79873V2.59873H10.8V3.79873C10.8 3.90482 10.8421 4.00656 10.9172 4.08157C10.9922 4.15659 11.0939 4.19873 11.2 4.19873C11.3061 4.19873 11.4078 4.15659 11.4828 4.08157C11.5579 4.00656 11.6 3.90482 11.6 3.79873V2.59873H14C14.3183 2.59873 14.6235 2.72516 14.8485 2.9502C15.0736 3.17525 15.2 3.48047 15.2 3.79873V6.59873Z" fill="black"/>
                                        </svg>
                                    </span>
                                    <p>{userDetail.age}</p>
                                </div>
                                <div className={styles.card__icon}>
                                    <span className={styles.card__title}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                                            <path d="M1.29527 5.15873C2.00876 7.94121 3.45682 10.4809 5.48798 12.512C7.51915 14.5432 10.0588 15.9912 12.8413 16.7047C14.9823 17.2497 16.8013 15.4087 16.8013 13.1987V12.1987C16.8013 11.6467 16.3523 11.2037 15.8033 11.1487C14.8929 11.0582 13.9992 10.8432 13.1473 10.5097L11.6273 12.0297C9.1524 10.8433 7.15668 8.8476 5.97027 6.37273L7.49027 4.85273C7.15643 4.00084 6.94109 3.10717 6.85027 2.19673C6.79627 1.64673 6.35327 1.19873 5.80127 1.19873H4.80127C2.59127 1.19873 0.750269 3.01773 1.29527 5.15873Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                    <p>{userDetail.phone}</p>
                                </div>
                                <div className={styles.card__icon}>
                                    <span className={styles.card__title}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 18" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.21612 16.5999C8.22247 15.7307 9.15385 14.7859 10.0013 13.7748C11.7863 11.6402 12.8721 9.53551 12.9456 7.66407C12.9747 6.90349 12.8424 6.14514 12.5567 5.43431C12.271 4.72348 11.8377 4.07475 11.2827 3.52689C10.7277 2.97902 10.0623 2.54326 9.32643 2.24562C8.59053 1.94799 7.79915 1.79459 6.99956 1.79459C6.19998 1.79459 5.4086 1.94799 4.67269 2.24562C3.93679 2.54326 3.27145 2.97902 2.71644 3.52689C2.16143 4.07475 1.72812 4.72348 1.4424 5.43431C1.15668 6.14514 1.02442 6.90349 1.0535 7.66407C1.12787 9.53551 2.21462 11.6402 3.99875 13.7748C4.84615 14.7859 5.77753 15.7307 6.78388 16.5999C6.88071 16.6831 6.95275 16.7437 7 16.7814L7.21612 16.5999ZM6.35425 17.5701C6.35425 17.5701 0 12.4764 0 7.46418C0 5.69707 0.737498 4.00233 2.05025 2.75279C3.36301 1.50325 5.14348 0.80127 7 0.80127C8.85652 0.80127 10.637 1.50325 11.9497 2.75279C13.2625 4.00233 14 5.69707 14 7.46418C14 12.4764 7.64575 17.5701 7.64575 17.5701C7.29225 17.88 6.71038 17.8766 6.35425 17.5701ZM7 9.7962C7.64978 9.7962 8.27295 9.5505 8.73241 9.11317C9.19188 8.67583 9.45 8.08267 9.45 7.46418C9.45 6.84569 9.19188 6.25253 8.73241 5.81519C8.27295 5.37785 7.64978 5.13216 7 5.13216C6.35022 5.13216 5.72705 5.37785 5.26759 5.81519C4.80812 6.25253 4.55 6.84569 4.55 7.46418C4.55 8.08267 4.80812 8.67583 5.26759 9.11317C5.72705 9.5505 6.35022 9.7962 7 9.7962ZM7 10.7956C6.07174 10.7956 5.1815 10.4446 4.52513 9.81987C3.86875 9.1951 3.5 8.34774 3.5 7.46418C3.5 6.58062 3.86875 5.73325 4.52513 5.10848C5.1815 4.48372 6.07174 4.13272 7 4.13272C7.92826 4.13272 8.8185 4.48372 9.47487 5.10848C10.1313 5.73325 10.5 6.58062 10.5 7.46418C10.5 8.34774 10.1313 9.1951 9.47487 9.81987C8.8185 10.4446 7.92826 10.7956 7 10.7956Z" fill="black"/>
                                        </svg>
                                    </span>
                                    <p>{userDetail.address}</p>
                                </div>
                                <div className={styles.card__icon}>
                                    <span className={styles.card__title}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 15" fill="none">
                                            <path d="M11.154 8.26327H15.231V7.26327H11.154V8.26327ZM11.154 5.49327H15.231V4.49327H11.154V5.49327ZM2.769 11.1093H9.385V10.9433C9.385 10.3599 9.09167 9.90827 8.505 9.58827C7.91833 9.26827 7.109 9.10827 6.077 9.10827C5.045 9.10827 4.23533 9.26827 3.648 9.58827C3.06067 9.90827 2.76767 10.3599 2.769 10.9433V11.1093ZM6.077 7.49327C6.499 7.49327 6.85433 7.34894 7.143 7.06027C7.43233 6.77094 7.577 6.41527 7.577 5.99327C7.577 5.57127 7.43233 5.21594 7.143 4.92727C6.85367 4.6386 6.49833 4.49394 6.077 4.49327C5.65567 4.4926 5.30033 4.63727 5.011 4.92727C4.72167 5.21727 4.577 5.5726 4.577 5.99327C4.577 6.41394 4.72167 6.7696 5.011 7.06027C5.30033 7.35094 5.65567 7.49527 6.077 7.49327ZM1.616 14.8013C1.15533 14.8013 0.771 14.6473 0.463 14.3393C0.155 14.0313 0.000666667 13.6466 0 13.1853V2.41727C0 1.9566 0.154333 1.57227 0.463 1.26427C0.771667 0.956269 1.15567 0.801936 1.615 0.80127H16.385C16.845 0.80127 17.229 0.955603 17.537 1.26427C17.845 1.57294 17.9993 1.95727 18 2.41727V13.1863C18 13.6463 17.8457 14.0306 17.537 14.3393C17.2283 14.6479 16.8443 14.8019 16.385 14.8013H1.616ZM1.616 13.8013H16.385C16.5383 13.8013 16.6793 13.7373 16.808 13.6093C16.9367 13.4813 17.0007 13.3399 17 13.1853V2.41727C17 2.26327 16.936 2.12194 16.808 1.99327C16.68 1.8646 16.539 1.8006 16.385 1.80127H1.615C1.46167 1.80127 1.32067 1.86527 1.192 1.99327C1.06333 2.12127 0.999333 2.2626 1 2.41727V13.1863C1 13.3396 1.064 13.4806 1.192 13.6093C1.32 13.7379 1.461 13.8019 1.615 13.8013" fill="black"/>
                                        </svg>
                                    </span>
                                    <p>{userDetail.aadhaar}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.button_group}>
                    {isEditing ? (
                        <>
                            <button onClick={handleSave}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                                    <path d="M14 19V17C14 15.114 14 14.172 13.414 13.586C12.828 13 11.886 13 10 13H9C7.114 13 6.172 13 5.586 13.586C5 14.172 5 15.114 5 17V19" stroke="#ffffffff"/>
                                    <path d="M5 6H10" stroke="#ffffffff" stroke-linecap="round"/>
                                    <path d="M1 7C1 4.172 1 2.757 1.879 1.879C2.757 1 4.172 1 7 1H14.172C14.58 1 14.785 1 14.968 1.076C15.151 1.152 15.297 1.296 15.586 1.586L18.414 4.414C18.704 4.704 18.848 4.848 18.924 5.032C19 5.215 19 5.42 19 5.828V13C19 15.828 19 17.243 18.121 18.121C17.243 19 15.828 19 13 19H7C4.172 19 2.757 19 1.879 18.121C1 17.243 1 15.828 1 13V7Z" stroke="#ffffffff"/>
                                </svg>
                            </button>
                            <button onClick={() => {setIsEditing(false); setEditedUser(user);}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1404 1.80676L10.1937 0.860107L6.00035 5.06011L1.80701 0.860107L0.860352 1.80676L5.06035 6.00011L0.860352 10.1935L1.80701 11.1401L6.00035 6.94011L10.1937 11.1401L11.1404 10.1935L6.94035 6.00011L11.1404 1.80676Z" fill="#ffffffff"/>
                                </svg>
                            </button>
                        </>
                    ): (
                        <button onClick={() => setIsEditing(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                                <path d="M0.5 17.8423H17.4C17.5326 17.8423 17.6598 17.7896 17.7536 17.6958C17.8473 17.6021 17.9 17.4749 17.9 17.3423C17.9 17.2097 17.8473 17.0825 17.7536 16.9887C17.6598 16.895 17.5326 16.8423 17.4 16.8423H0.5C0.367392 16.8423 0.240215 16.895 0.146446 16.9887C0.0526783 17.0825 0 17.2097 0 17.3423C0 17.4749 0.0526783 17.6021 0.146446 17.6958C0.240215 17.7896 0.367392 17.8423 0.5 17.8423ZM6.662 14.0843C7.08418 13.9655 7.46946 13.7419 7.782 13.4343L17.322 3.89429C17.6487 3.5663 17.8321 3.12222 17.8321 2.65929C17.8321 2.19635 17.6487 1.75227 17.322 1.42429L16.382 0.494286C16.0491 0.176996 15.6069 0 15.147 0C14.6871 0 14.2449 0.176996 13.912 0.494286L4.372 10.0243C4.06436 10.3352 3.84368 10.7214 3.732 11.1443L2.992 13.9043C2.95721 14.0304 2.95646 14.1634 2.98984 14.2899C3.02321 14.4164 3.08952 14.5318 3.182 14.6243C3.32372 14.7632 3.51359 14.842 3.712 14.8443L6.662 14.0843ZM7.072 12.7243C6.88759 12.9119 6.65621 13.0466 6.402 13.1143L5.432 13.3743L4.432 12.3743L4.692 11.4043C4.76104 11.1506 4.89554 10.9196 5.082 10.7343L5.462 10.3643L7.452 12.3543L7.072 12.7243ZM8.162 11.6443L6.172 9.65429L12.902 2.92429L14.892 4.91429L8.162 11.6443ZM16.612 3.19429L15.602 4.20429L13.612 2.21429L14.622 1.19429C14.7626 1.05384 14.9532 0.974946 15.152 0.974946C15.3508 0.974946 15.5414 1.05384 15.682 1.19429L16.612 2.13429C16.7515 2.27542 16.8297 2.46586 16.8297 2.66429C16.8297 2.86272 16.7515 3.05315 16.612 3.19429Z" fill="#ffffffff"/>
                            </svg>
                        </button>
                    )}
                    <button className={styles.Calendarbutton} onClick={() => handleOpenCalendar(user.username)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 40" fill="none">
                            <path d="M10.6665 1.66667V9M25.3332 1.66667V9" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M30.8333 5.33333H5.16667C3.14162 5.33333 1.5 6.97495 1.5 9V34.6667C1.5 36.6917 3.14162 38.3333 5.16667 38.3333H30.8333C32.8584 38.3333 34.5 36.6917 34.5 34.6667V9C34.5 6.97495 32.8584 5.33333 30.8333 5.33333Z" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.5 16.3333H34.5M10.6667 23.6667H10.685M18 23.6667H18.0183M25.3333 23.6667H25.3517M10.6667 31H10.685M18 31H18.0183M25.3333 31H25.3517" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className={styles.Calendar_container}>
                {showCalendar && (
                    <>
                        <div>
                            <Calendar username = {selectedUsername} />
                            <button className={styles.closeBtn} onClick = {handleCloseCalendar} >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1404 1.80676L10.1937 0.860107L6.00035 5.06011L1.80701 0.860107L0.860352 1.80676L5.06035 6.00011L0.860352 10.1935L1.80701 11.1401L6.00035 6.94011L10.1937 11.1401L11.1404 10.1935L6.94035 6.00011L11.1404 1.80676Z" fill="#000000ff"/>
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}