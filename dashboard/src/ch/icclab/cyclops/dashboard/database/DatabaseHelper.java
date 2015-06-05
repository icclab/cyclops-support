package ch.icclab.cyclops.dashboard.database;

import ch.icclab.cyclops.dashboard.bills.Bill;
import ch.icclab.cyclops.dashboard.externalMeters.ExternalUserId;
import ch.icclab.cyclops.dashboard.util.LoadConfiguration;

import java.sql.*;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

public class DatabaseHelper {
    private final static String CREATE_TABLE_BILLS = "CREATE TABLE IF NOT EXISTS bills" +
            "(ID INTEGER PRIMARY KEY," +
            " userId        TEXT    NOT NULL, " +
            " billPDF       TEXT    NOT NULL, " +
            " fromDate      TEXT    NOT NULL, " +
            " toDate        TEXT    NOT NULL, " +
            " approved      BOOLEAN NOT NULL DEFAULT 0, " +
            " paid          BOOLEAN NOT NULL DEFAULT 0, " +
            " dueDate       TEXT    NOT NULL, " +
            " paymentDate   TEXT, " +
            " created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";

    private final static String CREATE_TABLE_METER_SOURCE = "CREATE TABLE IF NOT EXISTS meter_source" +
            "(ID INTEGER PRIMARY KEY," +
            " source        TEXT    NOT NULL)";

    private final static String CREATE_TABLE_EXTERNAL_ID = "CREATE TABLE IF NOT EXISTS external_id" +
            "(ID INTEGER PRIMARY KEY," +
            " userId        TEXT    NOT NULL, " +
            " meterSourceId INTEGER NOT NULL, " +
            " meterUserId   TEXT    NOT NULL)";

    private Connection openConnection() throws ClassNotFoundException, SQLException {
        Class.forName("org.sqlite.JDBC");
        String dbPath = LoadConfiguration.configuration.get("BILLING_DB_PATH");
        return DriverManager.getConnection("jdbc:sqlite:" + dbPath + "/bills.db");
    }

    public void createDatabaseIfNotExists() throws DatabaseInteractionException {
        try {
            Connection c = openConnection();
            Statement stmt = c.createStatement();
            stmt.executeUpdate(CREATE_TABLE_BILLS);
            stmt.executeUpdate(CREATE_TABLE_METER_SOURCE);
            stmt.executeUpdate(CREATE_TABLE_EXTERNAL_ID);
            stmt.close();
            c.close();
        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
    }

    public void addBill(String userId, String pdfPath, Bill bill) throws DatabaseInteractionException {
        try {
            Connection c = openConnection();
            PreparedStatement stmt = c.prepareStatement("INSERT INTO bills (ID, userId, billPDF, fromDate, toDate, dueDate) VALUES (NULL, ?, ?, ?, ?, ?)");
            stmt.setString(1, userId);
            stmt.setString(2, pdfPath);
            stmt.setString(3, bill.getFromDate());
            stmt.setString(4, bill.getToDate());
            stmt.setString(5, bill.getDueDate());
            stmt.executeUpdate();
            c.close();

        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
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
                bill.setDueDate(resultSet.getString("dueDate"));
                bill.setApproved(resultSet.getInt("approved") != 0);
                bill.setPaid(resultSet.getInt("paid") != 0);
                bills.add(bill);
            }

            c.close();

            return bills;
        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
        catch (ParseException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
    }

    public List<ExternalUserId> getExternalUserIds(String userId) throws DatabaseInteractionException {
        final String query = "" +
            "SELECT source, meterUserId " +
            "FROM  meter_source " +
            "LEFT JOIN " +
            "   (SELECT * FROM external_id WHERE userId = ?) " +
            "ON meterSourceId = meter_source.ID";

        List<ExternalUserId> result = new ArrayList<ExternalUserId>();

        try {
            Connection c = openConnection();
            PreparedStatement stmt = c.prepareStatement(query);
            stmt.setString(1, userId);
            ResultSet resultSet = stmt.executeQuery();

            while(resultSet.next()) {
                result.add(new ExternalUserId(resultSet.getString(1), resultSet.getString(2)));
            }

            c.close();
        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }

        return result;
    }

    public void updateExternalUserIds(String userId, List<ExternalUserId> externalUserIds) throws DatabaseInteractionException {
        try {
            Connection c = openConnection();

            //TODO: use database transactions

            //Remove existing items
            PreparedStatement delStmt = c.prepareStatement("DELETE FROM external_id WHERE userId = ?");
            delStmt.setString(1, userId);
            delStmt.executeUpdate();

            //Add all newly submitted entries
            PreparedStatement insStmt = c.prepareStatement("INSERT INTO external_id SELECT null, ?, meter_source.ID, ? FROM meter_source WHERE meter_source.source = ?");

            for(ExternalUserId exId : externalUserIds) {
                insStmt.setString(1, userId);
                insStmt.setString(2, exId.getUserId());
                insStmt.setString(3, exId.getSource());
                insStmt.addBatch();
            }

            insStmt.executeBatch();
            c.close();
        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
    }

    public void addExternalMeterSource(String meterSource) throws DatabaseInteractionException {
        try {
            Connection c = openConnection();

            //TODO: use database transactions

            //Check if source already exists in the DB
            PreparedStatement selStmt = c.prepareStatement("SELECT * FROM meter_source WHERE source = ?");
            selStmt.setString(1, meterSource);
            ResultSet resultSet = selStmt.executeQuery();
            boolean existsSource = resultSet.isBeforeFirst();

            if(!existsSource) {
                PreparedStatement insStmt = c.prepareStatement("INSERT INTO meter_source VALUES (NULL, ?)");
                insStmt.setString(1, meterSource);
                insStmt.executeUpdate();
            }

            c.close();
        }
        catch (ClassNotFoundException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
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
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
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
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
        catch (SQLException e) {
            throw new DatabaseInteractionException(e.getMessage(), e);
        }
    }
}
