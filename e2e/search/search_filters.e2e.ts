/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { LoginPage } from '../pages/adf/loginPage';
import { SearchDialog } from '../pages/adf/dialog/searchDialog';
import { SearchFiltersPage } from '../pages/adf/searchFiltersPage';
import { PaginationPage } from '../pages/adf/paginationPage';
import ContentList = require('../pages/adf/dialog/contentList');

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';

import TestConfig = require('../test.config');
import { Util } from '../util/util';
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Search Filters', () => {

    let loginPage = new LoginPage();
    let searchDialog = new SearchDialog();
    let searchFiltersPage = new SearchFiltersPage();
    let uploadActions = new UploadActions();
    let paginationPage = new PaginationPage();
    let contentList = new ContentList();

    let acsUser = new AcsUserModel();

    let filename = Util.generateRandomString(16);

    let fileModel = new FileModel({
        'name': filename, 'shortName': filename.substring(0, 8)
    });

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let fileUploaded, fileTypePng;

    let filter = { type: 'TYPE-PNG Image' };

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        fileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, fileModel.location, fileModel.name, '-my-');

        fileTypePng = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        await browser.driver.sleep(30000); // wait search index previous file/folder uploaded

        searchDialog.checkSearchIconIsVisible();
        searchDialog.clickOnSearchIcon();
        searchDialog.enterTextAndPressEnter(fileUploaded.entry.name);

        searchFiltersPage.checkSearchFiltersIsDisplayed();

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileUploaded.entry.id);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileTypePng.entry.id);

        done();
    });

    it('[C286298] Should be able to cancel a filter using "x" button from the toolbar', () => {
        let userOption = `${acsUser.firstName} ${acsUser.lastName}`;
        searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption)
            .checkChipIsDisplayed(userOption)
            .removeFilterOption(userOption)
            .checkChipIsNotDisplayed(userOption);
    });

    it('[C277146] Should Show more/less buttons be hidden when inactive', () => {
        browser.get(TestConfig.adf.url + '/search;q=*');

        searchFiltersPage.creatorCheckListFiltersPage().checkShowLessButtonIsNotDisplayed()
            .checkShowMoreButtonIsDisplayed()
            .clickShowMoreButtonUntilIsNotDisplayed()
            .checkShowLessButtonIsDisplayed()
            .clickShowLessButtonUntilIsNotDisplayed();
    });

    it('[C286556] Search categories should preserve their collapsed/expanded state after the search', () => {
        browser.get(TestConfig.adf.url + '/search;q=*');

        searchFiltersPage.clickFileTypeListFilter()
            .checkFileTypeFilterIsCollapsed()
            .clickFileSizeFilterHeader()
            .checkFileSizeFilterIsCollapsed();

        searchFiltersPage.creatorCheckListFiltersPage().clickCheckListOption('Administrator');

        searchFiltersPage.checkFileTypeFilterIsCollapsed()
            .checkFileSizeFilterIsCollapsed();
    });

    it('[C287796] Should be able to display the correct bucket number after selecting a filter', () => {
        browser.get(TestConfig.adf.url + '/search;q=*');

        searchFiltersPage.fileTypeCheckListFiltersPage().clickCheckListOption('PNG Image');

        let bucketNumberForFilter = searchFiltersPage.fileTypeCheckListFiltersPage().getBucketNumberOfFilterType(filter.type);

        let resultFileNames = contentList.getAllRowsNameColumn();

        expect(bucketNumberForFilter).not.toEqual('0');

        expect(paginationPage.getTotalNumberOfFiles()).toEqual(bucketNumberForFilter);

        resultFileNames.then((fileNames) => {
            fileNames.map((nameOfResultFiles) => {
                expect(nameOfResultFiles).toContain('.png');
            });
        });
    });

});
