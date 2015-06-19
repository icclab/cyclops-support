package ch.icclab.cyclops.dashboard.errorreporting;

import ch.icclab.cyclops.dashboard.util.LoadConfiguration;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;

/**
 * This class reports exceptions to a RabbitMQ instance. The RabbitMQ endpoint
 * and credentials are configured in /WEB-INF/configuration.txt with the following fields:
 *
 * ERROR_REPORTER_HOST
 * ERROR_REPORTER_PORT
 * ERROR_REPORTER_VIRTUAL_HOST
 * ERROR_REPORTER_USERNAME
 * ERROR_REPORTER_PASSWORD
 * ERROR_REPORTER_ENABLED
 *
 * Errors will only be reported if ERROR_REPORTER_ENABLED is set to "true"
 */
public class ErrorReporter {
    private static final String EXCHANGE_NAME = "cyclops";

    public static void reportException(Exception ex) {
        if(isExceptionReportingEnabled()) {
            try {
                Connection conn = getConnection();
                Channel channel = conn.createChannel();
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ex.printStackTrace(new PrintStream(baos));
                channel.basicPublish(EXCHANGE_NAME, "dashboard-errors", null, baos.toByteArray());
                channel.close();

            } catch (IOException e) {
                System.err.println("Failed to open connection for error reporting: " + e.getMessage());
            }
        }
    }

    public static boolean isExceptionReportingEnabled() {
        String enabled = LoadConfiguration.configuration.get("ERROR_REPORTER_ENABLED");
        return enabled.equals("true");
    }

    private static Connection getConnection() throws IOException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(LoadConfiguration.configuration.get("ERROR_REPORTER_HOST"));
        factory.setPort(Integer.parseInt(LoadConfiguration.configuration.get("ERROR_REPORTER_PORT")));
        factory.setVirtualHost(LoadConfiguration.configuration.get("ERROR_REPORTER_VIRTUAL_HOST"));
        factory.setUsername(LoadConfiguration.configuration.get("ERROR_REPORTER_USERNAME"));
        factory.setPassword(LoadConfiguration.configuration.get("ERROR_REPORTER_PASSWORD"));
        return factory.newConnection();
    }
}
