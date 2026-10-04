PriyoniX Integrated Business ERP – MVP
About the Project
PriyoniX Integrated Business ERP is a full-stack Enterprise Resource Planning (ERP) web application developed as an MVP for a software company.
The system integrates Employee & HR Management, CRM & Lead Management, Project Management, Finance & Invoice Management, Digital Marketing, and Management Dashboard into a single platform.
Main workflow:
Marketing Campaign → Lead → Client → Project → Employee → Task → Invoice → Payment → Management Dashboard
Tech Stack
Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- REST APIs
- Maven
Database
- MySQL
- MySQL Workbench
Development Tools
- Visual Studio Code
- Git
- GitHub
- Postman
How to Run the Project
1. Database Setup
Make sure MySQL is installed and running.
Create the database:
CREATE DATABASE priyonix_erp;
Configure the MySQL username and password in the backend configuration file.
Example:
spring.datasource.url=jdbc:mysql://localhost:3306/priyonix_erp
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
2. Backend Setup
Open a terminal and navigate to the backend folder:
cd erp
Build the backend:
mvn clean install
Start the backend:
mvn spring-boot:run
Backend URL:
http://localhost:8081
3. Frontend Setup
Open a new terminal and navigate to the frontend folder:
cd frontend
Install dependencies:
npm install
Start the frontend:
npm run dev
Frontend URL:
http://localhost:5173
Open the frontend URL in your browser.
Project Structure
PriyoniX-Integrated-Business-ERP/
│
├── erp/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
Main Modules
Employee & HR
- Employee management
- Attendance
- Leave management
- Employee roles
CRM
- Lead management
- Lead follow-up
- Lead conversion
- Client management
Project Management
- Project creation
- Project team
- Milestones
- Tasks
- Subtasks
- Task progress
Finance
- Invoice management
- Payment tracking
- Expenses
- Revenue
- Profit
- Outstanding payments
Digital Marketing
- Campaign management
- Campaign metrics
- Content calendar
- Lead generation
Management Dashboard
- Business overview
- Project statistics
- Employee statistics
- CRM statistics
- Financial statistics
- Marketing statistics
- Alerts and notifications
Security Note
This project is developed as an MVP for demonstration and development purposes.
Do not commit database passwords, API keys, .env files, or other sensitive information to GitHub.
