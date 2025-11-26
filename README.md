# Antigrav ETF - Education Trust Fund Platform

A comprehensive web-based platform for managing scholarship applications, donations, and financial operations for the CCC Central Cathedral Abuja Education Trust Fund.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fantigrav-etf&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,DATABASE_URL,RESEND_API_KEY,ADMIN_EMAIL&envDescription=Required%20environment%20variables%20for%20the%20ETF%20platform&envLink=https%3A%2F%2Fgithub.com%2Fyour-username%2Fantigrav-etf%23environment-variables&project-name=antigrav-etf&repository-name=antigrav-etf)

Click the button above to deploy your own instance of the ETF platform to Vercel.

## ✨ Features

### 🎓 Applicant Portal
- **Multi-step Application Form**: Personal, Academic, Family, and Document information
- **Document Upload**: Secure file storage with Supabase Storage
- **User Dashboard**: Track application status and progress
- **Email Notifications**: Automatic confirmations on submission
- **Responsive Design**: Works seamlessly on all devices

### 👨‍💼 Admin Portal
- **Application Management**: Review, approve, and reject applications
- **Screening System**: Financial, academic, and church scoring
- **Disbursement Tracking**: Record payments and generate vouchers
- **Financial Management**: Budget planning and transaction tracking
- **Donations Module**: Donor management with receipt generation
- **Reports & Analytics**: Comprehensive insights and visualizations
- **Role-based Access**: SuperAdmin and Admin roles

### 💰 Financial Features
- Budget allocation and tracking
- Transaction management (Income/Expense/Transfer)
- Donation tracking with donor profiles
- Receipt generation system
- Monthly financial trends
- CSV export capabilities

### 📊 Reporting & Analytics
- Application statistics and trends
- Gender and education level breakdowns
- Monthly application patterns
- Top schools by applications
- Financial summaries
- Donor analytics

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Email**: Resend
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Lucide icons
- **Deployment**: Vercel

## 📋 Prerequisites

Before deploying, you'll need:

1. **Supabase Account**: [Sign up here](https://supabase.com)
2. **Resend Account**: [Sign up here](https://resend.com) (for email notifications)
3. **GitHub Account**: To host your repository
4. **Vercel Account**: [Sign up here](https://vercel.com)

## 🔧 Environment Variables

You'll need to set up the following environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key
ADMIN_EMAIL=admin@example.com

# Application
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Getting Your Environment Variables:

#### Supabase Variables:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Go to **Settings** → **Database**
6. Copy **Connection string** → `DATABASE_URL` (replace `[password]` with your actual password)

#### Resend API Key:
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key
3. Copy it → `RESEND_API_KEY`

## 📦 Manual Installation

If you prefer to set up locally:

```bash
# Clone the repository
git clone https://github.com/your-username/antigrav-etf.git
cd antigrav-etf

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Run database migrations
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🗄️ Database Setup

The platform uses Prisma with PostgreSQL. After setting up your environment variables:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### Initial Admin Setup

To create your first admin user:

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Run this query:

```sql
INSERT INTO "AdminUser" (id, email, name, role)
VALUES (
  gen_random_uuid(),
  'your-email@example.com',
  'Your Name',
  'SuperAdmin'
);
```

## 🔐 Authentication Setup

### Supabase Auth Configuration:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://your-app.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-app.vercel.app/**`
   - `http://localhost:3000/**` (for local development)

### Email Templates:

Configure email templates in Supabase:
- Go to **Authentication** → **Email Templates**
- Customize confirmation and password reset emails

## 📁 Storage Setup

### Supabase Storage Configuration:

The app uses a `documents` bucket for file uploads. This is automatically created via migration, but you can verify:

1. Go to **Storage** in Supabase
2. Ensure `documents` bucket exists
3. RLS policies should allow:
   - Public read access
   - Authenticated user uploads

## 🚀 Deployment

### Deploy to Vercel:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/antigrav-etf.git
   git push -u origin main
   ```

2. **Click the Deploy button** at the top of this README

3. **Configure environment variables** in Vercel dashboard

4. **Deploy!** Your app will be live in ~3 minutes

### Post-Deployment:

1. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables with your actual URL
2. Update Supabase redirect URLs with your Vercel URL
3. Test the application thoroughly

## 📖 Usage Guide

### For Applicants:

1. **Register**: Create an account at `/register`
2. **Apply**: Fill out the application form at `/apply/form`
3. **Upload Documents**: Submit required documents
4. **Track Status**: View application progress at `/dashboard`

### For Admins:

1. **Login**: Access admin portal at `/admin/login`
2. **Review Applications**: View and screen applications
3. **Approve/Reject**: Make decisions and add notes
4. **Record Disbursements**: Track payments to schools
5. **Manage Finances**: Create budgets and record transactions
6. **Track Donations**: Record donor contributions and issue receipts
7. **View Reports**: Access analytics and insights

## 🎨 Design Features

- **Modern UI**: Gradient backgrounds, glassmorphism effects
- **Smooth Animations**: Fade-in, slide, and scale animations
- **Responsive**: Mobile-first design
- **Accessible**: WCAG compliant
- **Dark Mode Ready**: (can be enabled)

## 📊 Key Modules

1. **Applications**: Multi-step form with validation
2. **Disbursements**: Payment tracking and voucher generation
3. **Finance**: Budget management and transaction tracking
4. **Donations**: Donor management with receipt system
5. **Reports**: Analytics and data visualization
6. **Dashboard**: User and admin dashboards

## 🔒 Security

- Role-based access control (RBAC)
- Supabase Row Level Security (RLS)
- Secure file uploads
- Email verification
- Protected admin routes
- Environment variable protection

## 🤝 Contributing

This is a private project for CCC Central Cathedral Abuja ETF. For questions or support, contact the development team.

## 📝 License

Proprietary - CCC Central Cathedral Abuja

## 🆘 Support

For technical support or questions:
- Email: akin4u@gmail.com
- Admin Portal: Contact your system administrator

## 🎯 Roadmap

- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Advanced reporting
- [ ] Automated payment integration
- [ ] Beneficiary portal
- [ ] Document verification system

---

**Built with ❤️ for CCC Central Cathedral Abuja Education Trust Fund**
