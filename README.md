# Demo Voting App
This is a modified version of the [NodeJS Cloud SQL example](https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/cloud-sql/mysql/mysql) used to demonstrate Cloud Run development in Cloud Code.

## Before you begin
1. Create a 2nd Gen Cloud SQL Instance by following these 
[instructions](https://cloud.google.com/sql/docs/mysql/create-instance). Note the connection string,
database user, and database password that you create.
1. Create a database for your application by following these 
[instructions](https://cloud.google.com/sql/docs/mysql/create-manage-databases). Note the database
name. 
1. Create a service account with the 'Cloud SQL Client' permissions by following these 
[instructions](https://cloud.google.com/sql/docs/mysql/connect-external-app#4_if_required_by_your_authentication_method_create_a_service_account).
1. Keep track of the information noted in the previous steps. This will be entered into Cloud Code run configurations later:
    ```
    CLOUD_SQL_CONNECTION_NAME='<MY-PROJECT>:<INSTANCE-REGION>:<MY-DATABASE>'
    DB_USER='my-db-user'
    DB_PASS='my-db-pass'
    DB_NAME='my_db'
    ```
1. Install [Cloud Code for IntelliJ](https://cloud.google.com/intellij) by following these [instructions](https://cloud.google.com/code/docs/intellij/install).

## Deploy to Cloud Run with Cloud Code for IntelliJ
1. Open this project in Cloud Code.
1. Add a new `Cloud Code: Cloud Run: Deploy` run configuration.
1. Select a `GCP Project` to deploy to using the project selector.
1. Select a GCP region to deploy to using the `Region` combobox.
1. Expand the `Advanced revision settings (container, environment variables, connections)` section.
1. Populate the `Environment Variables` field with the previously configured environment variables:
    - `CLOUD_SQL_CONNECTION_NAME`
    - `DB_USER`
    - `DB_PASS`
    - `DB_NAME`
1. Populate the `Cloud SQL Connection` field with the value of the `CLOUD_SQL_CONNECTION_NAME` environment variable. Example: `myproject:us-west1:mydb`.
1. Populate the `Service Account` field with the previously set up service account.
1. Press `OK` to save.
1. Run this run configuration.

When deployment finishes, you should see the deployed Cloud Run service link in the run output, and the new service in the Cloud Run Explorer. 

## Develop locally for Cloud Run with Cloud Code for IntelliJ
1. Open this project in Cloud Code.
1. Add a new `Cloud Code: Cloud Run: Run Locally` run configuration.
1. Expand the `Advanced revision settings (container, environment variables, connections)` section.
1. Populate the `Environment Variables` field with the previously configured environment variables:
    - `CLOUD_SQL_CONNECTION_NAME`
    - `DB_USER`
    - `DB_PASS`
    - `DB_NAME`
1. Populate the `Cloud SQL Connection` field with the value of the `CLOUD_SQL_CONNECTION_NAME` environment variable. Example: `myproject:us-west1:mydb`.
1. Populate the `Service Account` field with the previously set up service account.
1. Press `OK` to save.
1. Run this run configuration.

When deployment finishes, you should see the locally deployed Cloud Run service link in the Event Log.

For more details about using Cloud Run see http://cloud.run.
