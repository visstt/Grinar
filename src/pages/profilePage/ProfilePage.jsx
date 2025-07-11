import MyProjects from "./profileComponents/myProjects/MyProjects";
import ProfileMainInfo from "./profileComponents/profileMainInfo/ProfileMainInfo";
import ProfileTitle from "./profileComponents/profileTitle/ProfileTitle";

export default function ProfilePage() {
  return (
    <>
      <div style={{ marginBottom: 80 }}>
        <ProfileTitle />
      </div>
      {/* <MyProjects /> */}
      <ProfileMainInfo />
    </>
  );
}
