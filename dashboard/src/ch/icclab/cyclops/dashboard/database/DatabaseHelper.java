package ch.icclab.cyclops.dashboard.database;

import ch.icclab.cyclops.dashboard.bills.Bill;
import ch.icclab.cyclops.dashboard.util.LoadConfiguration;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DatabaseHelper {
    private Connection openConnection() throws ClassNotFoundException, SQLException {
        Class.forName("org.sqlite.JDBC");
        String dbPath = LoadConfiguration.configuration.get("BILLING_DB_PATH");
        return DriverManager.getConnection("jdbc:sqlite:" + dbPath + "/bills.db");
    }

    public void createDatabaseIfNotExists() throws DatabaseInteractionException {
        try {
            Connection c = openConnection();
            Statement stmt = c.createStatement();
            String sql = "CREATE TABLE IF NOT EXISTS bills" +
                    "(ID INTEGER PRIMARY KEY," +
                    " userId        TEXT    NOT NULL, " +
                    " billPDF       TEXT    NOT NULL, " +
                    " fromDate      TEXT    NOT NULL, " +
                    " toDate        TEXT    NOT NULL, " +
                    " created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
            stmt.executeUpdate(sql);
            stmt.close();
            c.close();
        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException("SQLite class not found", e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException("SQL Exception", e);
        }
    }

    public void addBill(String userId, String pdfPath, Bill bill) throws DatabaseInteractionException {
        try {
            Connection c = openConnection();
            PreparedStatement stmt = c.prepareStatement("INSERT INTO bills (ID, userId, billPDF, fromDate, toDate) VALUES (NULL, ?, ?, ?, ?)");
            stmt.setString(1, userId);
            stmt.setString(2, pdfPath);
            stmt.setString(3, bill.getFromDate());
            stmt.setString(4, bill.getToDate());
            stmt.executeUpdate();
            c.close();

        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException("SQLite class not found", e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException("SQL Exception", e);
        }
    }

    public List<Bill> getBillsForUser(String userId) throws DatabaseInteractionException {
        List<Bill> bills = new ArrayList<Bill>();

        try {
            Connection c = openConnection();
            PreparedStatement stmt = c.prepareStatement("SELECT * FROM bills WHERE userId = ?");
            stmt.setString(1, userId);
            ResultSet resultSet = stmt.executeQuery();

            while(resultSet.next()) {
                Bill bill = new Bill();
                bill.setFromDate(resultSet.getString("fromDate"));
                bill.setToDate(resultSet.getString("toDate"));
                bills.add(bill);
            }

            c.close();

            return bills;
        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException("SQLite class not found", e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException("SQL Exception", e);
        }
    }

    public boolean existsBill(String userId, Bill bill) throws DatabaseInteractionException {
        try {
            Connection c = openConnection();
            PreparedStatement stmt = c.prepareStatement("SELECT * FROM bills WHERE userId = ? AND fromDate = ? AND toDate = ?");
            stmt.setString(1, userId);
            stmt.setString(2, bill.getFromDate());
            stmt.setString(3, bill.getToDate());
            ResultSet resultSet = stmt.executeQuery();
            boolean hasBills = resultSet.isBeforeFirst();
            c.close();
            return hasBills;
        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException("SQLite class not found", e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException("SQL Exception", e);
        }
    }

    public String getBillPath(String userId, Bill bill) throws DatabaseInteractionException {
        try {
            Connection c = openConnection();
            PreparedStatement stmt = c.prepareStatement("SELECT billPDF FROM bills WHERE userId = ? AND fromDate = ? AND toDate = ?");
            stmt.setString(1, userId);
            stmt.setString(2, bill.getFromDate());
            stmt.setString(3, bill.getToDate());
            ResultSet resultSet = stmt.executeQuery();

            if(resultSet.next()) {
                String pdfPath = resultSet.getString("billPDF");
                c.close();
                return pdfPath;
            }
            else {
                c.close();
                throw new DatabaseInteractionException("No rows found");
            }

        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException("SQLite class not found", e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException("SQL Exception", e);
        }
    }
}
