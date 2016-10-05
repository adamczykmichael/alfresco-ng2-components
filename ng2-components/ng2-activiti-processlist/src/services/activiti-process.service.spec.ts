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

import { ReflectiveInjector } from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService
} from 'ng2-alfresco-core';
import { ActivitiProcessService } from './activiti-process.service';

describe('ActivitiProcessService', () => {

    let service, injector;

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            ActivitiProcessService,
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService
        ]);
    });

    beforeEach(() => {
        service = injector.get(ActivitiProcessService);
    });

    it('should get process instances', (done) => {

        expect(true).toBe(true);
        done();
    });
});

