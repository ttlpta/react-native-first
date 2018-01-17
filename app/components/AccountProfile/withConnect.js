import { connect } from 'react-redux';
import { logout, getProfilePatient, saveProfile } from 'app/redux/actions';

const mapStateToProps = state => ({
  profilePatient: state.user.profilePatient,
  dataAuth : state.user.dataAuth,
  facebookAuth : state.user.facebookAuth,
  isRequestingAccProfileData : state.user.isRequestingAccProfileData,
  isSavedProfileSuccess : state.user.isSavedProfileSuccess,
  isSavingProfileData : state.user.isSavingProfileData,
  saveProfileErrorMsg : state.user.saveProfileErrorMsg,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  getProfilePatient: userCode => dispatch(
    getProfilePatient(userCode)
  ),
  saveProfile: data => dispatch(saveProfile(data)),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
