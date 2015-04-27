package ch.icclab.cyclops.dashboard.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseHelper {
    private static Connection connection;

    public static Connection openConnection() {
        if(connection == null) {
            try {
                Class.forName("org.sqlite.JDBC");
                connection = DriverManager.getConnection("jdbc:sqlite:test.db");
            }
            catch(ClassNotFoundException cnfex) {
                //TODO: exception handling
            }
            catch (SQLException sqlex) {
                //TODO: exception handling
            }
        }

        return connection;
    }

    public static void closeConnection() {
        if(connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                //TODO: exception handling
            }
        }
    }
}
