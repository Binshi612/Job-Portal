const bcrypt = require("bcrypt");
const CompanyModel = require("../models/company-model");
const JobModel = require("../models/job-model");
const JobApplicationModel = require("../models/jobapplication-model");
//signup
const getCompanySignup = function (req, res) {
  res.render("company/signup", { title: "Company signup" });
};
const createNewCompany = async function (req, res) {
  console.log(req.body);
  try {
    let oldpassword = req.body.password;
    req.body.password = await bcrypt.hash(oldpassword, 10); //encrypting the password from company and adding it to the req.body object
    console.log(req.body);
    const company = await CompanyModel.create(req.body);
    req.session.alertMessage = "Successfully created an account";
    res.status(201).redirect("/company/login");
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Error in creating New account. Retry !!!!!";
    res.redirect("/company/signup");
  }
};
//login
const getCompanyLogin = function (req, res) {
  if (req.session.company) {
    res.redirect("/company");
  } else {
    let alertMessage = req.session.alertMessage;
    res.render("company/login", { title: "login", alertMessage });
    delete req.session.alertMessage;
  }
};
const doCompanyLogin = async function (req, res) {
  try {
    // console.log(req.body, req.body.password);
    let { password } = req.body;
    const company = await CompanyModel.findOne({ email: req.body.email });
    if (company) {
      const exist = await bcrypt.compare(password, company.password);
      if (exist) {
        req.session.company = company;
        req.session.alertMessage = "Logged In successfully";
        return res.redirect("/company");
      }
    }
    req.session.alertMessage = "Invalid login Credentials";
    res.redirect("/company/login");
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Error Occured. Please Retry !!!";
    res.redirect("/company/login");
  }
};
const geCompanytHomePage = function (req, res) {
  if (req.session.company) {
    let { company, alertMessage } = req.session; //fetching company and alert message stored inn session
    res.render("company/home-page", {
      title: "Job Portal",
      company,
      alertMessage,
    });
    delete req.session.alertMessage;
  } else res.redirect("/company/login");
};
const logout = function (req, res) {
  req.session.company = null;
  req.session.alertMessage = "Logged Out Successfully!!!";
  res.redirect("/company");
};
const getNewJobForm = function (req, res) {
  res.render("company/add-new-job", { company: req.session.company });
};
const createNewJob = async function (req, res) {
  console.log(req.body);
  try {
    let today = new Date().toLocaleDateString();
    req.body.datePosted = today;
    const job = await JobModel.create(req.body);
    req.session.alertMessage = "created  Job Successfully ";
    res.status(201).redirect("/company");
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Error in creating New account. Retry !!!!!";
    res.redirect("/company/add-new-job");
  }
};
//profile
const getProfilePage = function (req, res) {
  res.render("company/profile", { company: req.session.company });
};
const getCompanyUpdateForm = function (req, res) {
  const { user } = req.session;
  res.render("company/update-company", { id: req.params.id, user });
};
const updateCompanyProfile = async function (req, res) {
  // console.log(req.body);
  // console.log(req.files);
  try {
    let { id } = req.params;
    req.body.completed = true;
    const company = await CompanyModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (company) {
      let { image } = req.files;
      await image.mv("./public/images/company/" + id + ".jpg");
      req.session.company = company;
      req.session.alertMessage = "Updated Profile successfully";
      return res.redirect("/company");
    }
    req.session.alertMessage = "Couldn't Update Retry";
    res.redirect("/company");
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Couldn't Update Retry";
    res.redirect("/company");
  }
};
const getCompanyJobsPage = async function (req, res) {
  const jobs = await JobModel.find({ company_id: req.params.id });
  res.render("company/company-job-list");
};
const getCompanyApplications = async function (req, res) {
  const { _id } = req.session.company;
  const applications = await ApplicationModel.find({ company_id: _id });
  res.render("company/company-applicationlist", { applications });
};
const shortListApplication = function (req, res) {
  res.send("route is live");
};
const acceptApplication = function (req, res) {
  res.send("route is live");
};
const rejectApplication = function (req, res) {
  res.send("route is live");
};

module.exports = {
  getCompanyLogin,
  doCompanyLogin,
  getCompanySignup,
  createNewCompany,
  logout,
  geCompanytHomePage,
  getNewJobForm,
  createNewJob,
  getProfilePage,
  getCompanyUpdateForm,
  updateCompanyProfile,
  getCompanyJobsPage,
  getCompanyApplications,
  shortListApplication,
  acceptApplication,
  rejectApplication,
};
