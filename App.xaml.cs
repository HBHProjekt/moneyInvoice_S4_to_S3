using System.Windows;

namespace MoneyInvoice_s4_to_s3
{
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            // Additional startup logic can be added here
        }

        protected override void OnExit(ExitEventArgs e)
        {
            // Cleanup logic can be added here
            base.OnExit(e);
        }
    }
}