# 🎓 DegreePlanner - How to Use Guide

**DegreePlanner** is an intelligent academic planning system designed for AUI students. This guide will walk you through how to use the system based on your role.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Test Accounts](#test-accounts)
3. [Student Guide](#student-guide)
4. [Mentor Guide](#mentor-guide)
5. [Advisor Guide](#advisor-guide)
6. [Registrar Guide](#registrar-guide)
7. [Admin Guide](#admin-guide)
8. [Common Features](#common-features)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Accessing the Application

1. Open your web browser and navigate to the application URL
2. You'll see the login page
3. Enter your credentials (see [Test Accounts](#test-accounts) below)
4. Click "Login" to access your dashboard

### First Login

- After logging in, you'll be redirected to your role-specific dashboard
- The navigation menu on the left shows all available features for your role
- You can toggle between dark and light themes using the theme switcher

---

## 🔑 Test Accounts

### Student Account
- **Email**: `h.khalafalla@aui.ma`
- **Password**: `Drhoda123`

### Other Role Accounts
For Mentor, Advisor, Registrar, and Admin accounts:
- **Email Format**: `{role}1@aui.ma`
  - Mentor: `mentor1@aui.ma`
  - Advisor: `advisor1@aui.ma`
  - Registrar: `registrar@aui.ma`   
  - Admin: `admin@aui.ma`  
- **Password**: `whathever is before '@' is the password`

---

## 👨‍🎓 Student Guide

### Dashboard Overview

When you log in as a student, you'll see:
- **Credits Progress**: Total credits earned vs. required
- **GPA Summary**: Current GPA and academic standing
- **Assigned Mentor**: Your mentor's information (for Freshmen/Sophomores)
- **Assigned Advisor**: Your advisor's information
- **Review Status**: Current status of your degree plan review

### Building Your Degree Plan

1. **Navigate to Degree Plan Builder**
   - Click on "Degree Plan" in the left sidebar
   - You'll see your semesters organized by term and year

2. **Adding Courses**
   - Browse eligible courses in the right panel
   - Use the search bar to find specific courses
   - Drag and drop courses into your desired semester
   - Each course shows:
     - Course code and title
     - Credit hours
     - Prerequisites (if any)
     - Category (General Education, Computer Science, etc.)

3. **Organizing Semesters**
   - Create new semesters using the "Add Semester" button
   - Navigate between semesters using the arrows
   - Each semester displays:
     - Total credits
     - Number of courses
     - Term and year

4. **Course Prerequisites**
   - The system automatically validates prerequisites
   - You'll be warned if you try to add a course without completing prerequisites
   - Prerequisites must be placed in earlier semesters

5. **Removing Courses**
   - Click the remove (X) icon on any course card
   - If the course has dependents, you'll be warned and given options:
     - Remove only this course
     - Remove this course and all its dependents

### Submitting for Review

1. **When to Submit**
   - Complete all semesters in your degree plan
   - Ensure all courses meet prerequisites
   - Review your total credits and requirements

2. **How to Submit**
   - Click the "Submit for Review" button
   - The system creates review requests for all semesters
   - Your plan will be sent to:
     - **Mentor** (if you're a Freshman or Sophomore)
     - **Advisor** (directly for Juniors/Seniors, or after mentor approval)

3. **Review Status**
   - **PENDING_MENTOR**: Waiting for mentor review
   - **PENDING_ADVISOR**: Waiting for advisor review
   - **APPROVED**: Plan approved by advisor
   - **REJECTED**: Plan needs revision (see feedback)

### Viewing Feedback

1. **View Feedback Button**
   - Appears on each semester after review
   - Click to open the feedback modal

2. **Feedback Modal**
   - **Rejection Reason**: Displayed at the top if rejected
   - **Mentor Feedback Tab**: View mentor's comments
   - **Advisor Feedback Tab**: View advisor's comments

3. **After Rejection**
   - Review the feedback carefully
   - Make necessary changes to your degree plan
   - Resubmit for review

### Managing Your Profile

1. **Navigate to Profile**
   - Click "Profile" in the left sidebar

2. **Personal Information**
   - Click "Edit" to update your name or email
   - Changes are saved immediately

3. **Academic Information**
   - **Major**: Display only (set by admin)
   - **Minor**: Use the dropdown to select or change your minor
     - Select "None" to clear your minor
   - **Classification**: Display only (Freshman, Sophomore, Junior, Senior)
   - **Expected Graduation**: Display only

4. **Mentor & Advisor Cards**
   - View your assigned mentor (Freshmen/Sophomores only)
   - View your assigned advisor
   - Contact information is displayed

### Exporting Your Degree Plan

1. Click the "Export" button in the Degree Plan Builder
2. Your plan will be downloaded as a Word document (.docx)
3. The document includes:
   - All semesters with courses
   - Course details (code, title, credits, category)
   - Total credits per semester
   - Overall summary

---

## 👨‍🏫 Mentor Guide

### Dashboard Overview

As a mentor, you'll see:
- **Total Assigned Students**: Number of students you're mentoring
- **Pending Reviews**: Number of degree plans awaiting your review
- **Students by Classification**: Breakdown of your students
- **Review Statistics**: Approved vs. rejected plans

### Viewing Your Students

1. **Navigate to "My Students"**
   - See a list of all students assigned to you
   - Filter by classification or search by name

2. **Student Information**
   - Name, email, classification
   - Major and minor
   - Review status

3. **View Student Degree Plan**
   - Click on any student to view their degree plan
   - See all semesters and courses
   - Review course selections and prerequisites

### Reviewing Degree Plans

1. **Navigate to "Review Requests"**
   - See all pending review requests from your students

2. **Review Process**
   - Click on a student's review request
   - Review each semester individually
   - Add comments for specific semesters (optional)

3. **Adding Comments**
   - Hover over a semester
   - Click the comment icon
   - Enter feedback for the student
   - Comments are saved locally until final submission

4. **Making a Decision**
   - **Approve**: Click "Approve All Semesters"
     - All semesters move to PENDING_ADVISOR status
     - Student is notified via email
   - **Reject**: Click "Reject"
     - Enter a rejection reason (required)
     - Student must revise and resubmit
     - Student is notified via email

### Bulk Review

1. Review all semesters at once
2. Add individual comments per semester
3. Submit one decision for the entire degree plan
4. General rejection reason applies to all semesters if rejected

### Managing Your Profile

- Update your minor using the dropdown in Academic Information
- View your assigned advisor
- See your list of students in the profile page

---

## 👨‍💼 Advisor Guide

### Dashboard Overview

As an advisor, you'll see:
- **Total Assigned Students**: All students under your advisement
- **Pending Reviews**: Degree plans awaiting your final approval
- **Review Statistics**: Approval and rejection rates
- **Student Distribution**: Breakdown by classification

### Reviewing Degree Plans

1. **Navigate to "Review Requests"**
   - See all degree plans that have been approved by mentors
   - Or degree plans from Juniors/Seniors (no mentor review required)

2. **Review Process**
   - Similar to mentor review process
   - View all semesters and courses
   - Add semester-specific comments

3. **Final Approval**
   - **Approve**: Final approval of the degree plan
     - Status changes to APPROVED
     - Student can proceed with registration
   - **Reject**: Send back for revisions
     - Enter rejection reason
     - Student must revise and resubmit entire process

4. **Viewing Previous Reviews**
   - See mentor comments (if applicable)
   - Review prerequisite validation
   - Check total credits against requirements

### Managing Students

1. **View All Assigned Students**
   - Navigate to "My Students"
   - See complete list of advisees

2. **Student Details**
   - Academic information
   - Current degree plan status
   - Review history

---

## 📊 Registrar Guide

### Dashboard Overview

As a registrar, you have system-wide visibility:
- **Total Students**: All students in the system
- **Program Statistics**: Enrollment by major/minor
- **Review Metrics**: System-wide review statistics
- **Mentor/Advisor Distribution**: Assignment analytics

### Managing Programs

1. **Navigate to "Programs"**
   - View all academic programs
   - See program requirements by category

2. **Program Details**
   - Total credits required
   - Credit breakdown by category:
     - General Education
     - Computer Science Core
     - Engineering Science & Math
     - Minor courses
     - Free Electives

### Viewing All Reviews

1. **System-Wide Review Access**
   - See all review requests across all students
   - Filter by status (Pending, Approved, Rejected)
   - Filter by classification

2. **Analytics**
   - Track review processing times
   - Identify bottlenecks in the review workflow
   - Monitor mentor/advisor workloads

---

## 🔧 Admin Guide

### Dashboard Overview

As an admin, you have full system access:
- **User Management**: Total users by role
- **System Statistics**: Comprehensive metrics
- **Assignment Overview**: Mentor/advisor assignments
- **Review System Health**: Processing statistics

### User Management

1. **Navigate to "Users"**
   - View all users in the system
   - Filter by role
   - Search by name or email

2. **Managing Users**
   - **Change Role**: Update user roles
   - **Toggle Status**: Activate/deactivate accounts
   - **View Details**: See full user profile
   - **Update Classification**: Change student classification

3. **Creating Assignments**
   - Assign mentors to Freshmen/Sophomore students
   - Assign advisors to all students
   - View current assignments

### System Configuration

1. **Monitor Review Workflow**
   - Track all review requests
   - Identify stuck reviews
   - View system-wide statistics

2. **Data Management**
   - Access to all program data
   - View course catalog (Neo4j)
   - Monitor system health

---

## 🔄 Common Features

### Real-Time Chat

1. **Navigate to "Chat"**
   - See all your chat threads
   - Group chats (Mentor + Students)
   - Direct messages

2. **Sending Messages**
   - Click on a thread
   - Type your message
   - Press Enter to send

3. **Features**
   - Typing indicators
   - Read receipts (blue checkmark when all read)
   - Unread message counts
   - Real-time updates

### Theme Toggle

- Click the theme switcher in your profile or navigation
- Choose between light and dark mode
- Preference is saved locally

### Notifications

- Email notifications for:
  - Review approvals
  - Review rejections
  - Mentor/Advisor assignments
  - Password resets

### Password Management

1. **Forgot Password**
   - Click "Forgot Password" on login page
   - Enter your email
   - Check email for reset link (expires in 24 hours)
   - Create new password

2. **Change Password**
   - Currently done through password reset flow
   - Enter your email on reset page

---

## 🐛 Troubleshooting

### Login Issues

**Problem**: Can't log in
- **Solution**:
  - Double-check your email and password
  - Ensure email is exactly as shown in test accounts
  - Try password reset if needed
  - Clear browser cache and cookies

### Course Prerequisites

**Problem**: Can't add a course
- **Solution**:
  - Check if all prerequisites are met
  - Ensure prerequisites are in earlier semesters
  - Review course information for prerequisite list
  - Contact your advisor if prerequisites seem incorrect

### Review Status

**Problem**: Review status not updating
- **Solution**:
  - Refresh the page
  - Check that you submitted all semesters
  - Verify your mentor/advisor assignments
  - Contact support if status is stuck

### Drag and Drop Issues

**Problem**: Can't drag courses
- **Solution**:
  - Ensure you're using a supported browser (Chrome, Firefox, Edge)
  - Try refreshing the page
  - Check that the course is eligible for the semester
  - Verify the semester has been created

### Chat Not Working

**Problem**: Messages not sending/receiving
- **Solution**:
  - Check your internet connection
  - Refresh the page to reconnect WebSocket
  - Clear browser cache
  - Try logging out and back in

### Minor Selection Issues

**Problem**: Can't change minor
- **Solution**:
  - Ensure you're on your own profile page
  - Verify you're a Student or Mentor role
  - Refresh the page
  - Try selecting "None" first, then selecting a new minor

---

## 📞 Support

For technical issues or questions:
- Contact your system administrator
- Report bugs via the GitHub issues page
- Email: support@degreeplanner.com

---

## 🔐 Security Best Practices

1. **Never share your password**
2. **Log out when using shared computers**
3. **Use a strong, unique password**
4. **Report suspicious activity immediately**
5. **Keep your email secure**

---

## 📱 Browser Compatibility

Recommended browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Safari (latest)

Not recommended:
- ❌ Internet Explorer
- ❌ Old browser versions

---

## 🎯 Tips for Success

### For Students
- Plan ahead - start your degree plan early
- Review prerequisites carefully before adding courses
- Communicate with your mentor/advisor through chat
- Check feedback promptly after reviews
- Keep your profile information up to date

### For Mentors
- Review student plans thoroughly
- Provide constructive feedback
- Respond to review requests promptly
- Use the chat feature to discuss plans with students
- Monitor your pending reviews regularly

### For Advisors
- Check both mentor feedback and course selections
- Ensure degree requirements are met
- Provide clear feedback for rejections
- Track students' progress throughout semesters
- Coordinate with mentors when needed

---

## 📝 Workflow Summary

### Student Degree Plan Review Workflow

1. **Student** creates degree plan
   ↓
2. **Student** submits for review
   ↓
3. **Mentor** reviews (Freshmen/Sophomores only)
   - Approves → Go to step 4
   - Rejects → Back to step 1
   ↓
4. **Advisor** reviews (final approval)
   - Approves → ✅ APPROVED
   - Rejects → Back to step 1

### Junior/Senior Fast Track

1. **Student** creates degree plan
   ↓
2. **Student** submits for review
   ↓
3. **Advisor** reviews (directly, no mentor needed)
   - Approves → ✅ APPROVED
   - Rejects → Back to step 1

---

## 🎓 Getting Help

### Quick Links

- **Documentation**: See README.md for technical details
- **Implementation Status**: See DONE.md for feature list
- **GitHub Issues**: Report bugs or request features
- **Contact Admin**: Use in-app chat to reach administrators

### Common Questions

**Q: How do I know if my plan is approved?**
A: Check the review status badge on your degree plan. It will show "APPROVED" when finalized.

**Q: Can I edit my plan after submission?**
A: No, you must wait for feedback. If rejected, you can revise and resubmit.

**Q: Who do I contact about course eligibility?**
A: Contact your advisor through the chat feature or your academic department.

**Q: Can I change my minor after graduation?**
A: Contact the registrar's office for post-graduation changes.

**Q: How long does review take?**
A: Review times vary. Check with your mentor/advisor for estimated timelines.

---

**Last Updated**: December 2025
**Version**: 1.0
**For**: DegreePlanner Production System

---

🎓 **Happy Planning!** 🎓
